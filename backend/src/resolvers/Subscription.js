const newExecution = {
    subscribe: (parent, args, context, info) => {
        return context.prisma.$subscribe.execution({ mutation_in: ['CREATED'] }).node()
    },
    resolve: payload => {
        return payload
    },
}

module.exports = {
    newExecution,
}