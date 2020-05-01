function user(parent, { id }, context) {
    return context.prisma.user({ id })
}

module.exports = {
    user
}