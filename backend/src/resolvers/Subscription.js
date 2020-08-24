// The resolvers for subscriptions available. They are all manually triggered in the Mutation resolver 

// When a new execution is published
const newExecution = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('NEW_EXECUTION')
    }
}

// When a new task is published
const newTask = {
    subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('NEW_TASK')
    }
}

// When a task is deleted
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