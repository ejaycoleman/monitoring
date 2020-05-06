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
    return prisma.tasks()
}

module.exports = {
    currentUser,
    tasks
}