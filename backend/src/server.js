const { GraphQLServer } = require('graphql-yoga')
const { resolvers } = require('./resolvers') 
const fs = require('fs')
const path = require('path');
const CronJob = require('cron').CronJob;
const { createContext, pubsub, prisma } = require('./context')
const moment = require('moment')

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: createContext
})

const sendEmail = (email, task) => {
    console.log(`Sending an email to ${email} for task #${task}`)
}

const moveFiles = file => {
    const moveFiles = false // change this to true if you want files to be moved to /archived
    moveFiles && fs.rename(path.join(__dirname, '../ingress', file), path.join(__dirname, '../archive', file), err => {
        if (err) throw err;
        console.log('renamed complete');
    });
}
 
async function postExecution(taskId, datetime, file) {
    const associatedTask = await prisma.task.findOne({where: {number: taskId}, include: {executions: true}})
    const associatedNotifications = await prisma.task.findOne({where: {number: taskId}}).notifications().user()
    if (associatedTask && associatedTask.executions && associatedTask.executions.filter(execution => execution.datetime === datetime).length === 0 && associatedTask.approved) {
        if (datetime * 1000 > Date.now()) {
            moveFiles(file)
            return
        }

        associatedNotifications && associatedNotifications.map(notification => {
            if (notification.user.recieveEmailForRan) {
                sendEmail(notification.user.email, associatedTask.number)
            }
        })

        const newExecution = await prisma.execution.create({data: {
            datetime,
            task: { connect: { id: associatedTask.id } },
        }})
        pubsub.publish('NEW_EXECUTION', {
            newExecution
        })

        moveFiles(file)
    }
}

// RUN EVERY 5 SECONDS
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

// RUN DAILY
const notify = new CronJob('0 0 0 * * *', async function() {
    const tasks = await prisma.task.findMany()
    tasks.forEach(async task => {
        const executions = await prisma.task.findOne({where: {id: task.id}}).executions({orderBy: {datetime: 'desc'}})
        if (executions[0] && moment().startOf('day').subtract(task.frequency, task.period).isAfter(moment.unix(executions[0].datetime))) {
            const associatedNotifications = await prisma.task.findOne({where: {id: task.id}}).notifications({include: {user: true}})
            associatedNotifications.forEach(notif => {
                if (notif.user.recieveEmailForLate) {
                    console.log(`NOTIFY ${notif.user.email} THAT: ${task.number} wasnt run on time`)
                }
            })
        }
        if (executions.length === 0) {
            const associatedNotifications = await prisma.task.findOne({where: {id: task.id}}).notifications({include: {user: true}})
            associatedNotifications.forEach(notif => {
                if (notif.user.recieveEmailForNever) {
                    console.log(`NOTIFY ${notif.user.email} THAT: ${task.number} hasnt received any tasks`)
                }
            })
        }
    })
})
notify.start()

server.start(() => console.log('Server is running on http://localhost:4000'))