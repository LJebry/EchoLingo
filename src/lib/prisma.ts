import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL is not set")
  }

  // Always use the client with Accelerate support for your connection string
  return new PrismaClient().$extends(withAccelerate())
}

type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>

declare global {
  var prisma: undefined | PrismaClientExtended
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
