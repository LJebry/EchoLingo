import prisma from "@/lib/prisma"

export async function getUserConversations(userId: string) {
  return await prisma.conversation.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { turns: true }
      }
    }
  })
}

export async function getConversationWithTurns(id: string, userId: string) {
  return await prisma.conversation.findUnique({
    where: { id, ownerId: userId },
    include: {
      turns: {
        orderBy: { turnIndex: 'asc' },
        include: {
          speakerProfile: true
        }
      }
    }
  })
}

export async function createConversation(userId: string, title: string) {
  return await prisma.conversation.create({
    data: {
      ownerId: userId,
      title,
    }
  })
}

export async function deleteUserConversation(id: string, userId: string) {
  return await prisma.conversation.deleteMany({
    where: {
      id,
      ownerId: userId,
    },
  })
}
