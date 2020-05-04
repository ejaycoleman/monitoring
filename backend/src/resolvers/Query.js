async function currentUser(parent, args, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    return prisma.user({ id: user.id })
}

module.exports = {
    currentUser
}