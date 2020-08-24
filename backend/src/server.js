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

const sendEmail = (email, task, message) => {
    // When emails are implemented, they will be triggered by this method

    console.log(`Sending an email to ${email} for task #${task} saying: ${message}`)
}

const moveFiles = file => {
    // Moves files to archive once they have been run

    fs.rename(path.join(__dirname, '../ingress', file), path.join(__dirname, '../archive', file), err => {
        if (err) throw err;
    });
}
 
async function postExecution(taskId, datetime, file) {
    // Creates an executionn in the database, notifying users who have enabled notifications
    
    const associatedTask = await prisma.task.findOne({where: {number: taskId}, include: {executions: true}})
    const associatedNotifications = await prisma.task.findOne({where: {number: taskId}}).notifications().user()
    if (associatedTask && associatedTask.executions && associatedTask.approved) {
        if (datetime * 1000 > Date.now()) {
            moveFiles(file)
            return
        }

        // For each user expecting notifications, an email will be sent
        associatedNotifications && associatedNotifications.map(async notification => {
            const preferences = await prisma.preference.findOne({where: {userId: notification.user.id}})
            if (preferences.recieveEmailForRan) {
                sendEmail(notification.user.email, associatedTask.number, 'task run')
            }
        })

        const newExecution = await prisma.execution.create({data: {
            datetime,
            task: { connect: { id: associatedTask.id } },
        }})
        // Used for websockets, allowing live updates on the status page
        pubsub.publish('NEW_EXECUTION', {
            newExecution
        })

        moveFiles(file)
    }
}

// RUN EVERY 5 SECONDS, reading executions within the ingress directory
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

// RUN DAILY, triggering various notifications for users with them enabled
const notify = new CronJob('* * 0 * * *', async function() {
    const tasks = await prisma.task.findMany()
    tasks.forEach(async task => {
        const executions = await prisma.task.findOne({where: {id: task.id}}).executions({orderBy: {datetime: 'desc'}})
        if (executions[0] && moment().startOf('day').subtract(task.frequency, task.period).isAfter(moment.unix(executions[0].datetime))) {
            const associatedNotifications = await prisma.task.findOne({where: {id: task.id}}).notifications({include: {user: {include: {preference: true}}}})
            associatedNotifications.forEach(notif => {
                if (notif.user.preference.recieveEmailForLate) {
                    sendEmail(notif.user.email, task.number, 'Task wasn\'t run in time')
                }
            })
        }
        if (executions.length === 0) {
            const associatedNotifications = await prisma.task.findOne({where: {id: task.id}}).notifications({include: {user: {include: {preference: true}}}})
            associatedNotifications.forEach(notif => {
                if (notif.user.preference.recieveEmailForNever) {
                    sendEmail(notif.user.email, task.number, 'Task never executed')
                }
            })
        }
    })
})
notify.start()

// Creates an endpoint for downloading the tasks as a .json file
server.get('/file.json', async (err, res) => {
    prisma.task.findMany({select: {number: true, command: true, frequency: true, period: true}}).then(tasks => {
        res.status(200)
        res.json({tasks})
        res.end()
    }).catch(err => {
        res.status(500)
        res.send('there was an error')
        res.end()
    })
})

server.start(() => console.log('Server is running on http://localhost:4000'))