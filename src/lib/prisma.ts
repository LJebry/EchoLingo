import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL || 'prisma://accelerate.prisma-data.net/?api_key=placeholder'

  // In Prisma 7, Accelerate connections MUST be passed via the 'accelerateUrl' property.
  // Direct connections would use the 'adapter' property.
  return new PrismaClient({
    accelerateUrl: url,
  } as any).$extends(withAccelerate())
}

type PrismaClientExtended = ReturnType<typeof prismaClientSingleton>

declare global {
  var prisma: undefined | PrismaClientExtended
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
