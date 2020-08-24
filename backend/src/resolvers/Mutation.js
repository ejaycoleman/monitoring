const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User registration mutation (hashes passwords and initialises data)
async function register(parent, { isAdmin, email, password }, context) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await context.prisma.user.create({
        data: {
            isAdmin,
            email,
            password: hashedPassword,
            preference: { create: { executionThresholdIdeal: '', 
            executionThresholdAbsolute: '',
            receiveEmailForLate: true,
            receiveEmailForNever: true,
            receiveEmailForRan: true}}
        }
    })
    return user
}

// User login mutation, returns an authentication token if credentials are correct
async function login(parent, {email, password}, context) {
    const user = await context.prisma.user.findOne({where: {email}})
    if (!user) {
        throw new Error("Invalid Login")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new Error('Invalid Login')
    }

    const token = jwt.sign(
        {id: user.id},
        'the-project-secret',
        {expiresIn: '7d'}
    )

    return {
        token,
        user
    }
}

// Mutation for creating a task
async function uploadSingleTask(parent, { number, command, frequency, period }, {user, prisma, pubsub}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})

    if (!Number.isInteger(number) || number <= 0) {
        throw new Error(`Task number (${number}) must be a positive integer`)
    }
    if (command === '') {
        throw new Error(`Task #${number} - command must not be empty`)
    }
    if (!Number.isInteger(frequency) || frequency <= 0) {
        throw new Error(`Task #${number} - frequency must be a positive integer (got ${frequency})`)
    }
    if (!['days', 'weeks', 'months'].includes(period)) {
        throw new Error(`Period must be either 'days', 'weeks', or 'months' (got ${period})`)
    }

    try {
        const newTask = await prisma.task.create({
            data: {
                author: { connect: { id: user.id } },
                approved: fullUser.isAdmin,
                number,
                command,
                frequency,
                period
            }
        })

        // Created a websocket event
        pubsub.publish('NEW_TASK', {
            newTask
        })
    
        return newTask 
    } catch (e) {
        if (e.message.includes('Unique constraint failed on the constraint: `number`')) {
            throw new Error(`Task #${number} already present`)
        } else {
            throw new Error(e.message)
        }
    }
}

async function approveTask(parent, { number }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    
    if (!fullUser.isAdmin) {
        throw new Error('Incorrect Privileges')
    }

    return prisma.task.update({where: {number: parseInt(number)}, data: {approved: true}})
}

// Endpoint for when a user wants to receive notifications for a task
async function toggleNotification(parent, { taskNumber }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    const fullTask = await prisma.task.findMany({where: {number: parseInt(taskNumber)}})
    const existing = await prisma.taskNotification.findMany({where: {AND: [{user: fullUser}, {task: fullTask[0]}]}})

    if (existing.length === 0) {
        return prisma.taskNotification.create({
            data: {
                user: { connect: {id: fullUser.id}}, 
                task: { connect: {id: fullTask[0].id}}
            }
        })
    }

    return prisma.taskNotification.delete({where: {id: existing[0].id}})
}

// Mutation for users to set preferences
async function setPreferences(parent, data, {user, prisma}) {
    const { 
        idealFrequency, 
        idealPeriod, 
        absoluteFrequency, 
        absolutePeriod, 
        receiveEmailForLate, 
        receiveEmailForNever, 
        receiveEmailForRan } = data

    if (!user) {
        throw new Error('Not Authenticated')
    }

    const userPreference = await prisma.user.findOne({where: {id: user.id}}).preference()

    // currently only one part of the preferences can be changed
    // maybe update all preferences in one go (rather than threshold preferences/notification preferences)
    if (idealFrequency && idealPeriod && absoluteFrequency && absolutePeriod) {
        const multiplier = {days: 1, weeks: 7, months: 30}
        if (parseInt(absoluteFrequency) * multiplier[absolutePeriod] < parseInt(idealFrequency) * multiplier[idealPeriod]) {
            throw new Error('warning must be sooner than error')
        }

        if (parseInt(absoluteFrequency) <= 0 || parseInt(idealFrequency) <= 0) {
            throw new Error('Values must not be negative')
        }

        const executionThresholdIdeal = `${idealFrequency}-${idealPeriod}`
        const executionThresholdAbsolute = `${absoluteFrequency}-${absolutePeriod}`
        return prisma.preference.update({where: {id: userPreference.id}, data: {executionThresholdIdeal, executionThresholdAbsolute}})
    } else if (receiveEmailForLate !== null || receiveEmailForNever !== null || receiveEmailForRan !== null) {
        return prisma.preference.update({where: {id: userPreference.id}, data: {receiveEmailForLate, receiveEmailForNever, receiveEmailForRan}})
    }
    throw new Error('Unexpected parameters')
}

// How admins and non-admins modify tasks
async function modifyTask(parent, { number, command, frequency, period, enabled }, { user, prisma }) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    const fullTask = await prisma.task.findOne({where: {number: parseInt(number)}, include: {author: true}})
    let approved = true

    if (!fullUser.isAdmin && fullTask.author.email !== fullUser.email) {
        throw new Error('Incorrect Privileges')
    } else if (!fullUser.isAdmin && fullTask.author.email === fullUser.email) {
        approved = false
    }

    if (!Number.isInteger(number) || number <= 0) {
        throw new Error(`Task number (${number}) must be a positive integer`)
    }

    if (command === '') {
        throw new Error(`Task #${number} - command must not be empty`)
    }

    if (!Number.isInteger(frequency) || frequency <= 0) {
        throw new Error(`Task #${number} - frequency must be a positive integer (got ${frequency})`)
    }
    
    if (!['days', 'weeks', 'months'].includes(period)) {
        throw new Error(`Period must be either 'days', 'weeks', or 'months' (got ${period})`)
    }

    return prisma.task.update({where: {number}, data: {command, frequency, period, enabled, approved}})
}

// Mutation for removing tasks
async function removeTask(parent, { taskNumber }, { user, prisma, pubsub }) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    const fullTask = await prisma.task.findOne({where: {number: parseInt(taskNumber)}, include: {author: true}})
    

    if (!fullUser.isAdmin && fullTask.author.email !== fullUser.email) {
        throw new Error('Incorrect Privileges')
    }

    await prisma.execution.deleteMany({where: { taskId: fullTask.id}})
    await prisma.taskNotification.deleteMany({where: {taskId: fullTask.id}})
    const task = await prisma.task.delete({where: {id: fullTask.id}})

    pubsub.publish('TASK_DELETED', { 
        taskDeleted: fullTask
    })

    return task
}

module.exports = {
    register,
    login,
    uploadSingleTask,
    approveTask,
    toggleNotification,
    setPreferences,
    modifyTask,
    removeTask
}