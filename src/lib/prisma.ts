import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL is not set")
  }

  // Prisma Accelerate URLs (prisma+postgres:// or prisma://)
  if (url.startsWith("prisma://") || url.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      datasources: {
        db: {
          url: url,
        },
      },
    })
  }

  // Standard PostgreSQL URL
  return new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
