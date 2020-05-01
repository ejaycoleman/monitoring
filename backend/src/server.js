const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('../generated/prisma-client')

const resolvers = {
    Query: {
        user: (parent, { id }, context) => {
            return context.prisma.user({ id })
        }
    },
    Mutation: {
        createUser(parent, { isAdmin, email, password }, context) {
            return context.prisma.createUser({
                isAdmin,
                email,
                password
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        prisma,
    }
})

server.start(() => console.log('Server is running on http://loclahost:4000'))