const Query = require('./Query')
const Mutation = require('./Mutation')
const Task = require('./Task')
const Subscription = require('./Subscription')
const Execution = require('./Execution')
const User = require('./User')
const TaskNotification = require('./TaskNotification')

const resolvers = {
    Query, 
    Mutation,
    Subscription,
    Task,
    Execution,
    User,
    TaskNotification
}

module.exports = {
    resolvers
}