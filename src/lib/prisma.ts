import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set. Please add it to your Vercel project settings.")
  }

  // Determine if we should use the Accelerate URL property or standard URL
  const isAccelerate = url.startsWith("prisma://") || url.startsWith("prisma+postgres://")

  try {
    if (isAccelerate) {
      // In Prisma 7, Accelerate URLs are passed via accelerateUrl
      // We also cast to any to avoid TypeScript Subset type errors if the definitions are slightly out of sync
      return new PrismaClient({
        accelerateUrl: url,
      } as any)
    }

    // Direct connection to PostgreSQL
    return new PrismaClient({
      datasourceUrl: url,
    } as any)
  } catch (error) {
    console.error("Failed to initialize Prisma Client:", error)
    throw error
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
