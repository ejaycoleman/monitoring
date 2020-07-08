const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function register(parent, { isAdmin, email, password }, context) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await context.prisma.user.create({
        data: {
            isAdmin,
            email,
            password: hashedPassword
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
        {
            id: user.id,
            email: user.email,
            admin: user.isAdmin
        },
        'the-project-secret',
        {
            expiresIn: '7d'
        }
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

async function approveTask(parent, { id }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    
    if (!fullUser.isAdmin) {
        throw new Error('Incorrect Privileges')
    }

    return prisma.task.update({where: {id: parseInt(id)}, data: {approved: true}})
}

async function rejectTask(parent, { id }, {user, prisma, pubsub}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    const fullTask = await prisma.task.findOne({where: {id: parseInt(id)}})
    
    if (!fullUser.isAdmin) {
        throw new Error('Incorrect Privileges')
    }

    if (fullTask.approved) {
        throw new Error('Task already approved')
    }
    
    const task = await prisma.task.delete({where: {id: parseInt(id)}})

    pubsub.publish('TASK_REJECTED', {
        taskDeleted: fullTask
    })

    return task
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

async function setPreferences(parent, { idealFrequency, idealPeriod, absoluteFrequency, absolutePeriod }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const userPreference = await prisma.user.findOne({where: {id: user.id}}).preference()
    const executionThresholdIdeal = `${idealFrequency}-${idealPeriod}`
    const executionThresholdAbsolute = `${absoluteFrequency}-${absolutePeriod}`
    
    if (userPreference === null) {
        return prisma.preference.create({data: {forUser: {connect: { id: user.id }}, executionThresholdIdeal, executionThresholdAbsolute}})
    } else {
        return prisma.preference.update({where: {id: userPreference.id}, data: {executionThresholdIdeal, executionThresholdAbsolute}})
    }
}

async function modifyTask(parent, { number, command, frequency, period, enabled }, { user, prisma }) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})

    if (!fullUser.isAdmin) {
        throw new Error('Incorrect Privileges')
    }

    return prisma.task.update({where: {number}, data: {command, frequency, period, enabled}})
}

async function removeTask(parent, { taskNumber }, { user, prisma, pubsub }) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    const fullTask = await prisma.task.findOne({where: {number: parseInt(taskNumber)}})
    

    if (!fullUser.isAdmin) {
        throw new Error('Incorrect Privileges')
    }

    await prisma.execution.deleteMany({where: { taskId: fullTask.id}})
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
    rejectTask,
    toggleNotification,
    setPreferences,
    modifyTask,
    removeTask
}