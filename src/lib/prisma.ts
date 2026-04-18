import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL

  if (!url) {
    // During build time on Vercel, this might be missing, 
    // but we need a valid-looking string to prevent initialization crashes.
    return new PrismaClient().$extends(withAccelerate())
  }

  // We pass the URL directly to the constructor as 'datasourceUrl'.
  // We use 'as any' because Prisma 7's generated types sometimes omit this 
  // when the schema datasource is defined via config file.
  return new PrismaClient({
    datasourceUrl: url
  } as any).$extends(withAccelerate())
}

type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>

declare global {
  var prisma: undefined | PrismaClientExtended
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
