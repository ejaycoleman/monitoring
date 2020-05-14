async function currentUser(parent, args, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    return prisma.user({ id: user.id })
}

async function tasks(parent, args, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    const approved = args.approved === undefined ? true : args.approved
    return prisma.tasks({where: {approved}})
}

module.exports = {
    currentUser,
    tasks
}