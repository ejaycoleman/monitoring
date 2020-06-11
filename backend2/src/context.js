const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

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

const createContext = ({request}) => {
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
    createContext
}