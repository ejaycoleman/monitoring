const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('../generated/prisma-client')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Task = require('./resolvers/Task')
const Subscription = require('./resolvers/Subscription')
const Execution = require('./resolvers/Execution')

const jwt = require('jsonwebtoken')

const CronJob = require('cron').CronJob;
const fs = require('fs')

const getUser = token => {
    try {
        if (token) {
            return jwt.verify(token, 'the-project-secret')
        }
        return null
    } catch(err) {
        return null
    }
}

const resolvers = {
    Query, 
    Mutation,
    Subscription,
    Task,
    Execution
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: ({request}) => {
        if (!request) {
            return {prisma}
        }
        
        const tokenWithBearer = request.headers.authorization || ''
        const token = tokenWithBearer.split(' ')[1]
        const user = getUser(token)

        return {
            user,
            prisma
        }
    }
})

async function postExecution(taskId, datetime) {
    const associatedTask = await prisma.task({number: taskId})
    const associatedExecutions = await prisma.task({number: taskId}).executions()
    if (associatedExecutions.filter(execution => execution.datetime === datetime).length === 0) {
        await prisma.createExecution({
            datetime,
            task: { connect: { id: associatedTask.id } },
        })
    }
}

const job = new CronJob('*/5 * * * * *', function() {
    fs.readdir('/Users/elliottcoleman/work/monitoring/ingress', (err, files) => {
        files.forEach(file => {
            const [ taskDate, taskExecution, last ] = file.split("_")
            const taskId = last && last.match(/\d+/)[0]
            if (isNaN(Date.parse(taskDate)) || isNaN(taskExecution) || taskId === null) {
                return
            }
            postExecution(parseInt(taskId), Date.parse(taskDate)/1000)
        });
    });
});

job.start();
server.start(() => console.log('Server is running on http://localhost:4000'))