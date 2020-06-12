const newExecution = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('PUBSUB_NEW_MESSAGE')
    }
}

const newTask = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('PUBSUB_NEW_MESSAGE')
    }
}

const taskDeleted = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('PUBSUB_NEW_MESSAGE')
    }
}

module.exports = {
    newExecution,
    newTask,
    taskDeleted
}