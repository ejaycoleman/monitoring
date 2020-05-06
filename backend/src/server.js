const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('../generated/prisma-client')

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')

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
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: ({request}) => {
        const tokenWithBearer = request.headers.authorization || ''
        const token = tokenWithBearer.split(' ')[1]
        const user = getUser(token)

        return {
            user,
            prisma
        }
    }
})

const taskObj = {}

async function loadTasks() {
    const myTasks = await prisma.tasks()
    myTasks.forEach(task => {
        if (Object.keys(taskObj).includes(task.number.toString())) {
            console.log("FOUND")
        }
    })
}

const job = new CronJob('* * * * * *', function() {
    fs.readdir('/Users/elliottcoleman/work/monitoring/ingress', (err, files) => {
        files.forEach(file => {
            const [ taskDate, taskExecution, last ] = file.split("_")
            const taskId = last && last.match(/\d+/)[0]
            if (isNaN(Date.parse(taskDate)) || isNaN(taskExecution) || taskId === null) {
                return
            }
            taskObj[taskId] = {lastExecuted: Date.parse(taskDate)/1000}
        });
    });
    loadTasks();
});

job.start();
server.start(() => console.log('Server is running on http://localhost:4000'))