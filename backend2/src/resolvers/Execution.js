function task(parent, args, context) {
    return context.prisma.execution({id: parent.id}).task()
}

module.exports = {
    task
}