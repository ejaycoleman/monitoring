async function currentUser(parent, args, { user, prisma }) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    return prisma.user.findOne({where: { id: user.id }})
}

async function tasks(parent, args, { user, prisma }) {
    const approved = args.approved === undefined ? true : args.approved
    return prisma.task.findMany({where: {approved}})
    
}

module.exports = {
    currentUser,
    tasks
}