function tasks(parent, args, {prisma}) {
    return prisma.user.findOne({where: { id: parent.id }}).tasks()
}

function notifications(parent, args, {prisma}) {
    return prisma.user.findOne({where: { id: parent.id }}).notifications()
}

function preference(parent, args, {prisma, user}) {
    if (!user) {
        return null
    }
    return prisma.user.findOne({where: { id: parent.id }}).preference()
}

module.exports = {
    tasks,
    notifications,
    preference
}