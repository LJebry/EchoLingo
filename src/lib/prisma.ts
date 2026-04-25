import prismaBase from './prisma-base'
import { getCurrentUser } from './session'

/**
 * Prisma Client extended with Row Level Security (RLS).
 * It automatically sets the 'app.current_user_id' session variable 
 * before every query based on the current authenticated user.
 */
const prisma = prismaBase.$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        const user = await getCurrentUser()
        const userId = user?.id || ''

        // Wrap the query in a transaction to set the local session variable.
        // SET LOCAL ensures the variable is only visible within this transaction.
        return prismaBase.$transaction(async (tx) => {
          await tx.$executeRawUnsafe(`SET LOCAL app.current_user_id = '${userId}'`)
          return query(args)
        })
      },
    },
  },
})

export default prisma
