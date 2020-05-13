function executions(parent, args, context) {
    return context.prisma.task({ id: parent.id }).executions()
}

function author(parent, args, context) {
    return context.prisma.task({ id: parent.id }).author()
}

module.exports = {
    executions,
    author
}