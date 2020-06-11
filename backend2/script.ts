import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// A `main` function so that you can use async/await
async function main() {
  // ... you will write your Prisma Client queries here
  const test = await prisma.user.create({
    data: {
      email: 'email@email.com',
      password: 'password123'
    }
  })
  
  console.log(test)
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.disconnect()
  })
