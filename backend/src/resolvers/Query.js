async function currentUser(parent, { id }, {user, prisma}) {
    if (!user) {
        throw new Error('Not Authenticated')
    }
    return prisma.user({ id: user.id })
}

module.exports = {
    currentUser
}