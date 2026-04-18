import type { SpeakerProfile } from "@prisma/client"
import prisma from "@/lib/prisma"
import { deleteVoice } from "./elevenlabs"

export async function getUserSpeakerProfiles(userId: string): Promise<SpeakerProfile[]> {
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
}): Promise<SpeakerProfile> {
  return await prisma.speakerProfile.create({
    data
  })
}

export async function deleteSpeakerProfile(id: string, userId: string): Promise<void> {
  const profile = await prisma.speakerProfile.findUnique({
    where: { id }
  })

  if (!profile || profile.userId !== userId) {
    throw new Error("Profile not found or unauthorized")
  }

  // If there's an ElevenLabs voice ID, try to delete it there too
  if (profile.elevenLabsVoiceId) {
    await deleteVoice(profile.elevenLabsVoiceId)
  }

  await prisma.speakerProfile.delete({
    where: { id }
  })
}
