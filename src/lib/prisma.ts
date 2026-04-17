import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.DATABASE_URL

const prismaClientSingleton = () => {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set")
  }

  if (databaseUrl.startsWith("prisma://") || databaseUrl.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    })
  }

  return new PrismaClient({
    adapter: new PrismaPg(databaseUrl),
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
