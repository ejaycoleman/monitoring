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

var job = new CronJob('0 * * * * *', function() {
    fs.readdir('/Users/elliottcoleman/work/monitoring/ingress', (err, files) => {
        files.forEach(file => {
        //   console.log(file);
            console.log(file.split("_")[2])
        });
    });
});

job.start();
server.start(() => console.log('Server is running on http://loclahost:4000'))