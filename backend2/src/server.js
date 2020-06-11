const { GraphQLServer } = require('graphql-yoga')
const { resolvers } = require('./resolvers') 
// const { FileWatcher } = require('./utils')

const { createContext } = require('./context')

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: createContext
})

// const watchMyFiles = new FileWatcher('*/5 * * * * *')
// watchMyFiles.job.start();
server.start(() => console.log('Server is running on http://localhost:4000'))