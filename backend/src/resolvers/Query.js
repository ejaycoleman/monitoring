// return details about the user logged in
async function currentUser(parent, args, { user, prisma }) {
    if (!user) {
        return null
    }
    return prisma.user.findOne({where: { id: user.id }})
}

// Query all tasks
async function tasks(parent, args, { user, prisma }) {
    return prisma.task.findMany()    
}

module.exports = {
    currentUser,
    tasks,
}