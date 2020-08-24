// Resolver to link tasks, notifications and preferences to the user entitity

// Return associated tasks when user is queried
function tasks(parent, args, {prisma}) {
    return prisma.user.findOne({where: { id: parent.id }}).tasks()
}

// Return associated notifications when user is queried
function notifications(parent, args, {prisma}) {
    return prisma.user.findOne({where: { id: parent.id }}).notifications()
}

// Return associated preferences when user is queried
function preference(parent, args, {prisma, user}) {
    return prisma.user.findOne({where: { id: parent.id }}).preference()
}

module.exports = {
    tasks,
    notifications,
    preference
}