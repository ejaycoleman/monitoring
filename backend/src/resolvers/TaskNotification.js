// Resolver to link users and tasks to the taskNotification entity

// Return associated user when notification is queried
function user(parent, args, context) {
    return context.prisma.taskNotification.findOne({where: { id: parent.id }}).user()
}

// Return associated task when notification is queried
function task(parent, args, context) {
    return context.prisma.taskNotification.findOne({where: { id: parent.id }}).task()
}

module.exports = {
    user,
    task
}