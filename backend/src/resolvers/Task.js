function executions(parent, args, context) {
    return context.prisma.task({ id: parent.id }).executions()
}

module.exports = {
    executions,
}