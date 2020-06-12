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

async function uploadTasksFile(parent, args, {user, prisma, pubsub}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    
    try {
        myTasks = JSON.parse(args.tasks)   
        const promises = myTasks.tasks.map(async task => {
            if (task.command === '') {
                throw new Error('Command must not be empty')
            }
            if (task.frequency === 0) {
                throw new Error('Frequency must not be 0')
            }
            if (!['days', 'weeks', 'months'].includes(task.period)) {
                throw new Error(`Period must be either 'days', 'weeks', or 'months'`)
            }
            const result = await prisma.task.create({
                data: {
                    author: { 
                        connect: { 
                            id: user.id 
                        } 
                    },
                    approved: fullUser.isAdmin,
                    number: task.number,
                    command: task.command,
                    frequency: task.frequency,
                    period: task.period
                }
            })
            pubsub.publish('PUBSUB_NEW_MESSAGE', {
                newTask: result
            })
            return result        
        })

        return Promise.all(promises)
    }
    catch(e) {
        throw new Error('Expected a JSON file')
    }
    
}

async function uploadSingleTask(parent, { number, command, frequency, period }, {user, prisma, pubsub}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})

    if (command === '') {
        throw new Error('Command must not be empty')
    }
    if (frequency === 0) {
        throw new Error('Frequency must not be 0')
    }
    if (!['days', 'weeks', 'months'].includes(period)) {
        throw new Error(`Period must be either 'days', 'weeks', or 'months'`)
    }

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

    pubsub.publish('PUBSUB_NEW_MESSAGE', {
        newTask
    })

    return newTask
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

    pubsub.publish('PUBSUB_NEW_MESSAGE', {
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

    const userPreference = await prisma.user.findOne({where: {id: user.id}}).preference
    const executionThresholdIdeal = `${idealFrequency}-${idealPeriod}`
    const executionThresholdAbsolute = `${absoluteFrequency}-${absolutePeriod}`

    if (userPreference === null) {
        return prisma.preference.create({data: {forUser: {connect: { id: user.id }}, executionThresholdIdeal, executionThresholdAbsolute}})
    } else {
        return prisma.preference.update({where: {id: userPreference.id}, data: {executionThresholdIdeal, executionThresholdAbsolute}})
    }
}

async function modifyTask(parent, { number, command, frequency, period }, { user, prisma }) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user.findOne({where: {id: user.id}})

    if (!fullUser.isAdmin) {
        throw new Error('Incorrect Privileges')
    }

    return prisma.task.update({where: {number}, data: {command, frequency, period}})
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

    const task = await prisma.task.delete({where: {id: fullTask.id}})

    pubsub.publish('PUBSUB_NEW_MESSAGE', {
        taskDeleted: fullTask
    })


    return task
}

module.exports = {
    register,
    login,
    uploadTasksFile,
    uploadSingleTask,
    approveTask,
    rejectTask,
    toggleNotification,
    setPreferences,
    modifyTask,
    removeTask
}