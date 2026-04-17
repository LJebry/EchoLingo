import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { processTurn } from "@/lib/services/process-turn"
import { z } from "zod"

const turnSchema = z.object({
  conversationId: z.string().optional(),
  speakerProfileId: z.string().optional(),
  sourceLang: z.string(),
  targetLang: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const formData = await req.formData()
    
    const audioBlob = formData.get('audio') as Blob | null
    const conversationId = formData.get('conversationId') as string | undefined
    const speakerProfileId = formData.get('speakerProfileId') as string | undefined
    const sourceLang = formData.get('sourceLang') as string
    const targetLang = formData.get('targetLang') as string

    // Validate metadata
    const validation = turnSchema.safeParse({
      conversationId,
      speakerProfileId,
      sourceLang,
      targetLang
    })

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid metadata", details: validation.error.format() }, { status: 400 })
    }

    const result = await processTurn({
      audioBlob: audioBlob || undefined,
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
