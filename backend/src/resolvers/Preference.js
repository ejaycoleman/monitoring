function forUser(parent, args, context) {
    return context.prisma.preference({ id: parent.id }).forUser()
}

module.exports = {
    forUser
}