function task(parent, args, context) {
    return context.prisma.execution.findOne({where: {id: parent.id}}).task
}

module.exports = {
    task
}