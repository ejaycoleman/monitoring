const { GraphQLServer } = require('graphql-yoga')
const { resolvers } = require('./resolvers') 
const fs = require('fs')
const path = require('path');
const CronJob = require('cron').CronJob;
const { createContext, pubsub, prisma } = require('./context')

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: createContext
})

const sendEmail = (email, task) => {
    console.log(`Sending an email to ${email} for task #${task}`)
}
 
async function postExecution(taskId, datetime, file) {
    const associatedTask = await prisma.task.findOne({where: {number: taskId}, include: {executions: true}})
    const associatedNotifications = await prisma.task.findOne({where: {number: taskId}}).notifications().user()
    if (associatedTask && associatedTask.executions && associatedTask.executions.filter(execution => execution.datetime === datetime).length === 0) {
        if (datetime * 1000 > Date.now()) {
            console.log(`Date ${datetime} for task #${taskId} is in the future!`)
            return
        }

        associatedNotifications && associatedNotifications.map(notification => {
            sendEmail(notification.user.email, associatedTask.number)
        })

        const newExecution = await prisma.execution.create({data: {
            datetime,
            task: { connect: { id: associatedTask.id } },
        }})
        pubsub.publish('NEW_EXECUTION', {
            newExecution
        })

        // fs.rename(path.join(__dirname, '../ingress', file), path.join(__dirname, '../archive', file), err => {
        //     if (err) throw err;
        //     console.log('renamed complete');
        // });
    }
}

const fileReaderCron = new CronJob('*/5 * * * * *', async function() {
    fs.readdir(path.join(__dirname, '../ingress'), (err, files) => {
        files.forEach(file => {
            const [ taskDate, taskExecution, last ] = file.split("_")
            const taskId = last && last.match(/\d+/)[0]
            if (!isNaN(Date.parse(taskDate)) && !isNaN(taskExecution) && taskId !== null) {
                postExecution(parseInt(taskId), Date.parse(taskDate)/1000, file)
            }
        });
    });
})
fileReaderCron.start()
server.start(() => console.log('Server is running on http://localhost:4000'))