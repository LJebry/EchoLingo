import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { processTurn } from "@/lib/services/process-turn"
import { z } from "zod"

const turnSchema = z.object({
  conversationId: z.string().optional(),
  speakerProfileId: z.string().optional(),
  sourceLang: z.string(),
  targetLang: z.string(),
  transcriptText: z.string().trim().min(1).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const formData = await req.formData()

    const audioBlob = formData.get('audio') as Blob | null
    const conversationId = (formData.get('conversationId') as string | null) || undefined
    const speakerProfileId = (formData.get('speakerProfileId') as string | null) || undefined
    const sourceLang = formData.get('sourceLang') as string
    const targetLang = formData.get('targetLang') as string
    const transcriptText = (formData.get('transcriptText') as string | null)?.trim() || undefined

    const validation = turnSchema.safeParse({
      conversationId,
      speakerProfileId,
      sourceLang,
      targetLang,
      transcriptText,
    })

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid metadata", details: validation.error.format() }, { status: 400 })
    }

    if (!audioBlob && !transcriptText) {
      return NextResponse.json({ error: "Audio or transcript text is required" }, { status: 400 })
    }

    const result = await processTurn({
      audioBlob: audioBlob || undefined,
      transcriptText,
      conversationId,
      speakerProfileId,
      sourceLang,
      targetLang,
      userId: session?.user?.id
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing turn:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
