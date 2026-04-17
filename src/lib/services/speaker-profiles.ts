import prisma from "@/lib/prisma"

export async function getUserSpeakerProfiles(userId: string) {
  return await prisma.speakerProfile.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createSpeakerProfile(data: {
  userId: string
  displayName: string
  sourceLanguage: string
  targetLanguage: string
  elevenLabsVoiceId?: string
}) {
  return await prisma.speakerProfile.create({
    data
  })
}
