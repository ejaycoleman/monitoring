// Return associated user when preferences is queried

function forUser(parent, args, context) {
    return context.prisma.preference.findOne({where: { id: parent.id }}).forUser()
}

module.exports = {
    forUser
}