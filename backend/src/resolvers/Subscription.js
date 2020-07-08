const newExecution = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('NEW_EXECUTION')
    }
}

const newTask = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('PUBSUB_NEW_MESSAGE')
    }
}

const taskDeleted = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('TASK_DELETED')
    }
}

module.exports = {
    newExecution,
    newTask,
    taskDeleted
}