import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL is not set")
  }

  // Prisma Accelerate (prisma:// or prisma+postgres://)
  if (url.startsWith("prisma://") || url.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      accelerateUrl: url,
    })
  }

  // Standard PostgreSQL connection string
  // Note: For direct connections in Prisma 7, you might need a driver adapter if not using Accelerate.
  // But usually, passing nothing and letting it read from the config is preferred, 
  // or passing the connection string if the client is generated for it.
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
