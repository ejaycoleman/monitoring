const { prisma } = require('../generated/prisma-client')
const CronJob = require('cron').CronJob;
const fs = require('fs')
const path = require('path');
const jwt = require('jsonwebtoken')

const sendEmail = (email, task) => {
    console.log(`Sending an email to ${email} for task #${task}`)
}
 
async function postExecution(taskId, datetime, prisma) {
    const associatedTask = await prisma.task({number: taskId})
    const associatedExecutions = await prisma.task({number: taskId}).executions()
    const associatedNotifications = await prisma.task({number: taskId}).notifications().user()
    if (associatedTask && associatedExecutions && associatedExecutions.filter(execution => execution.datetime === datetime).length === 0) {
        associatedNotifications.map(notification => {
            sendEmail(notification.user.email, associatedTask.number)
        })

        await prisma.createExecution({
            datetime,
            task: { connect: { id: associatedTask.id } },
        })
    }
}

class FileWatcher {
    constructor(period) {
        this.job = new CronJob(period, function() {
            fs.readdir(path.join(__dirname, '../ingress'), (err, files) => {
                files.forEach(file => {
                    const [ taskDate, taskExecution, last ] = file.split("_")
                    const taskId = last && last.match(/\d+/)[0]
                    if (!isNaN(Date.parse(taskDate)) && !isNaN(taskExecution) && taskId !== null) {
                        postExecution(parseInt(taskId), Date.parse(taskDate)/1000, prisma)
                    }
                });
            });
        });
    }
}

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

const context = ({request}) => {
    if (!request) {
        return { prisma }
    }
    
    const tokenWithBearer = request.headers.authorization || ''
    const token = tokenWithBearer.split(' ')[1]
    const user = getUser(token)

    return {
        user,
        prisma
    }
}

module.exports = {
    context,
    FileWatcher
}