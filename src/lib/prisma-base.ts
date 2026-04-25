import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("RUNTIME ERROR: DATABASE_URL is not defined in the environment.")
  }

  // Basic client without RLS extension
  return new PrismaClient({
    accelerateUrl: url,
  } as any).$extends(withAccelerate())
}

type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>

declare global {
  var prismaBase: undefined | PrismaClientExtended
}

const prismaBase = globalThis.prismaBase ?? prismaClientSingleton()

export default prismaBase

if (process.env.NODE_ENV !== 'production') globalThis.prismaBase = prismaBase
