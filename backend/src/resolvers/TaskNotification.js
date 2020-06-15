function user(parent, args, context) {
    return context.prisma.taskNotification.findOne({where: { id: parent.id }}).user()
}

function task(parent, args, context) {
    return context.prisma.taskNotification.findOne({where: { id: parent.id }}).task()
}

module.exports = {
    user,
    task
}