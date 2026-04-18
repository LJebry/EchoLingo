import { NextResponse } from "next/server"
import { synthesizeSpeechToBuffer } from "@/lib/services/elevenlabs"
import { z } from "zod"

const synthesizeSchema = z.object({
  text: z.string().trim().min(1),
  voiceId: z.string().trim().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = synthesizeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const audioBuffer = await synthesizeSpeechToBuffer(parsed.data.text, parsed.data.voiceId)

    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (error: any) {
    console.error("Synthesize API error details:", error)

    const status = error?.statusCode || error?.status || 500
    const message = error instanceof Error ? error.message : "Speech synthesis failed"

    return NextResponse.json({ error: message }, { status })
  }
}
