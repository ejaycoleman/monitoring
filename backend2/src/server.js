const { GraphQLServer } = require('graphql-yoga')
const { resolvers } = require('./resolvers') 
// const { FileWatcher } = require('./utils')

const CronJob = require('cron').CronJob;

const { createContext, pubsub, prisma } = require('./context')

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: createContext
})

// const watchMyFiles = new FileWatcher('*/5 * * * * *')
// watchMyFiles.job.start();

// pubsub.pubslish


const myCron = new CronJob('*/5 * * * * *', async function() {
    // const associatedTask = await prisma.task.findOne({where: {number: 17}})
    const execution = await prisma.execution.findOne({where: {id: 1}, include: {task: true}})
    pubsub.publish('PUBSUB_NEW_MESSAGE', {
        newExecution: execution
    })
})
myCron.start()

server.start(() => console.log('Server is running on http://localhost:4000'))