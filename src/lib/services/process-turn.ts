import { transcribeAudio, cleanTranscript, translateText } from "./openai"
import { synthesizeSpeech } from "./elevenlabs"
import prisma from "@/lib/prisma"

interface ProcessTurnOptions {
  audioBlob?: Blob
  conversationId?: string
  speakerProfileId?: string
  sourceLang: string
  targetLang: string
  userId?: string
}

export async function processTurn({
  audioBlob,
  conversationId,
  speakerProfileId,
  sourceLang,
  targetLang,
  userId
}: ProcessTurnOptions) {
  // 1. Transcribe (Mocked)
  const transcript = audioBlob 
    ? await transcribeAudio(audioBlob) 
    : "No audio provided - using manual input."

  // 2. Clean (Mocked)
  const cleanedTranscript = await cleanTranscript(transcript)

  // 3. Translate (Mocked)
  const translatedText = await translateText(cleanedTranscript, sourceLang, targetLang)

  // 4. Synthesize (Mocked)
  const audioUrl = await synthesizeSpeech(translatedText)

  // 5. Save to DB if authenticated and conversationId exists
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

    return { ...turn, success: true }
  }

  // If guest or no conversation, just return the result
  return {
    transcript: cleanedTranscript,
    translatedText,
    audioUrl,
    success: true
  }
}
