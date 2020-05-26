function tasks(parent, args, context) {
    return context.prisma.user({ id: parent.id }).tasks()
}

function notifications(parent, args, context) {
    return context.prisma.user({ id: parent.id }).notifications()
}

module.exports = {
    tasks,
    notifications
}