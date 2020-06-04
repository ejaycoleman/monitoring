const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function register(parent, { isAdmin, email, password }, context) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await context.prisma.createUser({
        isAdmin,
        email,
        password: hashedPassword
    })
    return user
}

async function login(parent, {email, password}, context) {
    const user = await context.prisma.user({email})

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

async function uploadTasksFile(parent, args, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    const fullUser = await prisma.user({id: user.id})
    
    try {
        myTasks = JSON.parse(args.tasks)   
        const promises = myTasks.tasks.map(async task => {
            if (task.frequency === 0) {
                throw new Error('Frequency must not be 0')
            }
            if (!['days', 'weeks', 'months'].includes(task.period)) {
                throw new Error(`Period must be either 'days', 'weeks', or 'months'`)
            }
            const result = await prisma.createTask({
                author: { connect: { id: user.id } },
                approved: fullUser.isAdmin,
                number: task.number,
                command: task.command,
                frequency: task.frequency,
                period: task.period
            })
            return result        
        })

        return Promise.all(promises)
    }
    catch(e) {
        throw new Error('Expected a JSON file')
    }
    
}

async function uploadSingleTask(parent, { number, command, frequency, period }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user({id: user.id})

    if (frequency === 0) {
        throw new Error('Frequency must not be 0')
    }
    if (!['days', 'weeks', 'months'].includes(period)) {
        throw new Error(`Period must be either 'days', 'weeks', or 'months'`)
    }

    return prisma.createTask({
        author: { connect: { id: user.id } },
        approved: fullUser.isAdmin,
        number,
        command,
        frequency,
        period
    })
}

async function approveTask(parent, { id }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    const fullUser = await prisma.user({id: user.id})
    
    if (!fullUser.isAdmin) {
        throw new Error('Incorrect Privileges')
    }

    return prisma.updateTask({where: {id}, data: {approved: true}})
}

async function toggleNotification(parent, { taskNumber }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user({id: user.id})
    const fullTask = await prisma.tasks({where: {number: parseInt(taskNumber)}})
    const existing = await prisma.taskNotifications({where: {AND: [{user: fullUser}, {task: fullTask[0]}]}})
    
    if (existing.length === 0) {
        return prisma.createTaskNotification({
            user: { connect: {id: fullUser.id}}, 
            task: { connect: {id: fullTask[0].id}}
        })
    }

    return prisma.deleteTaskNotification({id: existing[0].id})
}

async function setPreferences(parent, { idealFrequency, idealPeriod, absoluteFrequency, absolutePeriod }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const userPreference = await prisma.user({id: user.id}).preference()
    const executionThresholdIdeal = `${idealFrequency}-${idealPeriod}`
    const executionThresholdAbsolute = `${absoluteFrequency}-${absolutePeriod}`

    if (userPreference === null) {
        return prisma.createPreference({forUser: {connect: { id: user.id }}, executionThresholdIdeal, executionThresholdAbsolute})
    } else {
        return prisma.updatePreference({where: {id: userPreference.id}, data: {executionThresholdIdeal, executionThresholdAbsolute}})
    }
}

module.exports = {
    register,
    login,
    uploadTasksFile,
    uploadSingleTask,
    approveTask,
    toggleNotification,
    setPreferences
}