function tasks(parent, args, context) {
    return context.prisma.user.findOne({where: { id: parent.id }}).tasks()
}

function notifications(parent, args, context) {
    return context.prisma.user.findOne({where: { id: parent.id }}).notifications()
}

function preference(parent, args, context) {
    return context.prisma.user.findOne({where: { id: parent.id }}).preference()
}

module.exports = {
    tasks,
    notifications,
    preference
}