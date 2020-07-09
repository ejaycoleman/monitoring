const newExecution = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('NEW_EXECUTION')
    }
}

const newTask = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('NEW_TASK')
    }
}

const taskDeleted = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('TASK_DELETED')
    }
}

const taskRejected = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('TASK_REJECTED')
    }
}

const taskApproved = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('TASK_APPROVED')
    }
}

module.exports = {
    newExecution,
    newTask,
    taskDeleted,
    taskRejected,
    taskApproved
}