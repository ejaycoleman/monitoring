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

let taskIngressID = [] 

const taskObj = {}

async function loadTasks() {
    const myTasks = await prisma.tasks()
    myTasks.forEach(task => {
        if (taskIngressID.includes(task.number)) {
            console.log("FOUND")
        }
    })
}

var job = new CronJob('* * * * * *', function() {
    fs.readdir('/Users/elliottcoleman/work/monitoring/ingress', (err, files) => {
        taskIngressID = []
        files.forEach(file => {
            const taskId = file.split("_")[2]
            taskId && taskIngressID.push(parseInt(taskId.match(/\d+/g)[0]))
            taskId && (taskObj[taskIngressID.push(parseInt(taskId.match(/\d+/g)[0]))] = {date: file.split("_")[0]})
        });
    });
    console.log(taskObj)
    loadTasks();
});

job.start();
server.start(() => console.log('Server is running on http://localhost:4000'))