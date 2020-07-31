const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function register(parent, { isAdmin, email, password }, context) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await context.prisma.user.create({
        data: {
            isAdmin,
            email,
            password: hashedPassword,
            preference: { create: { executionThresholdIdeal: '', 
            executionThresholdAbsolute: '',
            recieveEmailForLate: true,
            recieveEmailForNever: true,
            recieveEmailForRan: true}}
        }
    })
    return user
}

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

async function setPreferences(parent, data, {user, prisma}) {
    const { 
        idealFrequency, 
        idealPeriod, 
        absoluteFrequency, 
        absolutePeriod, 
        recieveEmailForLate, 
        recieveEmailForNever, 
        recieveEmailForRan } = data

    if (!user) {
        throw new Error('Not Authenticated')
    }

    const userPreference = await prisma.user.findOne({where: {id: user.id}}).preference()

    // currently only one part of the preferences can be changed
    // maybe update all preferences in one go
    if (idealFrequency || idealPeriod || absoluteFrequency || absolutePeriod) {
        const executionThresholdIdeal = `${idealFrequency}-${idealPeriod}`
        const executionThresholdAbsolute = `${absoluteFrequency}-${absolutePeriod}`
        return prisma.preference.update({where: {id: userPreference.id}, data: {executionThresholdIdeal, executionThresholdAbsolute}})
    } else if (recieveEmailForLate || recieveEmailForNever || recieveEmailForRan) {
        return prisma.preference.update({where: {id: userPreference.id}, data: {recieveEmailForLate, recieveEmailForNever, recieveEmailForRan}})
    }
}

async function modifyTask(parent, { number, command, frequency, period, enabled }, { user, prisma }) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    const fullTask = await prisma.task.findOne({where: {number: parseInt(number)}, include: {author: true}})

    if (!fullUser.isAdmin && fullTask.author.email !== fullUser.email) {
        throw new Error('Incorrect Privileges')
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

    return prisma.task.update({where: {number}, data: {command, frequency, period, enabled}})
}

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