// Enables backend authentication and prisma

const { PrismaClient } = require('@prisma/client')
const { PubSub } = require('graphql-yoga')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
const pubsub = new PubSub()
pubsub.ee.setMaxListeners(30);

// verifies the authentication token is valid
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

// Provides prisma (for database), pubsub (for websockets) and user with each request
const createContext = ({request}) => {
    if (!request) {
        return { 
            prisma, 
            pubsub 
        }
    }
    
    const tokenWithBearer = request.headers.authorization || ''
    const token = tokenWithBearer.split(' ')[1]
    const user = getUser(token)

    return {
        user,
        prisma,
        pubsub
    }
}

module.exports = {
    createContext,
    pubsub,
    prisma
}