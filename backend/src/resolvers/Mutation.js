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
            email: user.email
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

    // myTasks = {
    //     "tasks":
    //         [
    //             {
    //                 "number": 17,
    //                 "command": "retrievelogs",
    //                 "frequency": 1,
    //                 "period": "weeks"
    //             },
    //             {
    //                 "number": 23,
    //                 "command": "retrievestats",
    //                 "frequency": 1,
    //                 "period": "days"
    //             },
    //             {
    //                 "number": 35,
    //                 "command": "refreshcache",
    //                 "frequency": 1,
    //                 "period": "months"
    //             },
    //             {
    //                 "number": 49,
    //                 "command": "obtainupdates",
    //                 "frequency": 2,
    //                 "period": "weeks"
    //             }
    //         ]
    // }
    
    myTasks = JSON.parse(args.tasks)

    created = []

   
    myTasks.tasks.forEach(async task => {
        const result = await prisma.createTask({
            command: task.command,
            frequency: task.frequency,
            period: task.period
        })
        created.push(result)
    })

    return created
}

module.exports = {
    register,
    login,
    uploadTasksFile
}