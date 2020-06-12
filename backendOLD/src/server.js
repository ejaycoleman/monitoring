const { GraphQLServer } = require('graphql-yoga')
const { resolvers } = require('./resolvers') 
const { context, FileWatcher } = require('./utils')

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context
})

const watchMyFiles = new FileWatcher('*/5 * * * * *')
watchMyFiles.job.start();
server.start(() => console.log('Server is running on http://localhost:4000'))