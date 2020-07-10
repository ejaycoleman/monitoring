async function currentUser(parent, args, { user, prisma }) {
    if (!user) {
        return null
    }
    return prisma.user.findOne({where: { id: user.id }})
}

async function tasks(parent, args, { user, prisma }) {
    const approved = args.approved === undefined ? true : args.approved
    return prisma.task.findMany({where: {approved}})
    
}

async function usersUnapprovedTasks(parent, args, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }

    return prisma.user.findOne({where: { id: user.id }}).tasks({where: {approved: false}})
}

module.exports = {
    currentUser,
    tasks,
    usersUnapprovedTasks
}