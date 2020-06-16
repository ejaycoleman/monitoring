async function currentUser(parent, args, { user, prisma }) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    return prisma.user.findOne({where: { id: user.id }})
}

async function tasks(parent, args, { user, prisma }) {
    if (!user) {
        const approved = args.approved === undefined ? true : args.approved
        return prisma.task.findMany({where: {AND: {approved, enabled: true}}})
    }
    const fullUser = await prisma.user.findOne({where: {id: user.id}})
    
    if (!fullUser.isAdmin) {
        const approved = args.approved === undefined ? true : args.approved
        return prisma.task.findMany({where: {AND: {approved, enabled: true}}})
    }

    const approved = args.approved === undefined ? true : args.approved
    return prisma.task.findMany({where: {approved}})
    
}

module.exports = {
    currentUser,
    tasks
}