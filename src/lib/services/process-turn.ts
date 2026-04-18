import { transcribeAudio, cleanTranscript, translateText } from "./openai"
import { synthesizeSpeech } from "./elevenlabs"
import prisma from "@/lib/prisma"

interface ProcessTurnOptions {
  audioBlob?: Blob
  transcriptText?: string
  conversationId?: string
  speakerProfileId?: string
  sourceLang: string
  targetLang: string
  userId?: string
}

export async function processTurn({
  audioBlob,
  transcriptText,
  conversationId,
  speakerProfileId,
  sourceLang,
  targetLang,
  userId
}: ProcessTurnOptions) {
  const transcript = audioBlob
    ? await transcribeAudio(audioBlob)
    : transcriptText?.trim() || "No audio provided - using manual input."

  const cleanedTranscript = await cleanTranscript(transcript)

  const translatedText = await translateText({
    text: cleanedTranscript,
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
  })

  let audioUrl: string | null = null
  let audioError: string | null = null

  try {
    audioUrl = await synthesizeSpeech(translatedText)
  } catch (error) {
    audioError =
      error instanceof Error ? error.message : "Speech synthesis is unavailable right now."
    console.warn("Continuing without synthesized audio:", audioError)
  }

  if (userId && conversationId) {
    const turnCount = await prisma.conversationTurn.count({
      where: { conversationId }
    })

    const turn = await prisma.conversationTurn.create({
      data: {
        conversationId,
        speakerProfileId,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        transcript: cleanedTranscript,
        cleanedTranscript,
        translatedText,
        audioUrl,
        turnIndex: turnCount + 1
      }
    })

    return { ...turn, audioError, success: true }
  }

  return {
    transcript: cleanedTranscript,
    translatedText,
    audioUrl,
    audioError,
    success: true
  }
}
