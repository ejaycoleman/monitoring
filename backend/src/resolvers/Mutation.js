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
    
    if (!fullUser.isAdmin) {
        throw new Error('Incorrect Privileges')
    }
    
    try {
        myTasks = JSON.parse(args.tasks)   
        const promises = myTasks.tasks.map(async task => {
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
        console.log("Unexpected Input")
        return []
    }
    
}

async function uploadSingleTask(parent, { number, command, frequency, period }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    const fullUser = await prisma.user({id: user.id})

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

async function toggleNotification(parent, { taskId }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    console.log(taskId)
    console.log(user.id)

    const existing = await prisma.taskNotifications({where: {user: user.id, task: taskId}})[0]

    if (!existing) {
        return prisma.createTaskNotification({
            user: user.id, 
            task: taskId
        })
    }

    return prisma.deleteManyTaskNotifications({user: user.id, task: taskId})[0]
}

module.exports = {
    register,
    login,
    uploadTasksFile,
    uploadSingleTask,
    approveTask,
    toggleNotification
}