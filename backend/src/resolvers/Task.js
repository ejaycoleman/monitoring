function executions(parent, args, context) {
    return context.prisma.task({ id: parent.id }).executions()
}

function author(parent, args, context) {
    return context.prisma.task({ id: parent.id }).author()
}

async function notifications(parent, args, {prisma, user}) {
    const fullUser = await prisma.user({id: user.id})
    return prisma.task({ id: parent.id }).notifications({where: {user: fullUser}})
}

module.exports = {
    executions,
    author,
    notifications
}