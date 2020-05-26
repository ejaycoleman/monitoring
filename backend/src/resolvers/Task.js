function executions(parent, args, context) {
    return context.prisma.task({ id: parent.id }).executions()
}

function author(parent, args, context) {
    return context.prisma.task({ id: parent.id }).author()
}

function notifications(parent, args, context) {
    return context.prisma.task({ id: parent.id }).notifications()
}

module.exports = {
    executions,
    author,
    notifications
}