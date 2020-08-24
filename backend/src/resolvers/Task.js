// Return associated executions when task is queried
function executions(parent, args, context) {
    return context.prisma.task.findOne({where: { id: parent.id }}).executions()
}

// Return associated author when task is queried
function author(parent, args, context) {
    return context.prisma.task.findOne({where: { id: parent.id }}).author()
}

// Return associated notifications (for logged in user) when task is queried
async function notifications(parent, args, {prisma, user}) {
    if (user) {
        const fullUser = await prisma.user.findOne({where: {id: user.id}})
        return prisma.task.findOne({where: { id: parent.id }}).notifications({where: {user: fullUser}})
    }
    return []
}

module.exports = {
    executions,
    author,
    notifications
}