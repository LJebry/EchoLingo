import { NextResponse } from "next/server"
import { Readable } from "node:stream"
import elevenlabs from "@/lib/elevenlabs"
import { z } from "zod"

const synthesizeSchema = z.object({
  text: z.string().trim().min(1),
  voiceId: z.string().trim().optional(),
})

async function streamToBuffer(stream: Readable) {
  const chunks: Buffer[] = []

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

async function getVoiceId(preferredVoiceId?: string) {
  if (preferredVoiceId) {
    return preferredVoiceId
  }

  if (process.env.ELEVENLABS_VOICE_ID) {
    return process.env.ELEVENLABS_VOICE_ID
  }

  const voiceResponse = await elevenlabs.voices.getAll()
  return voiceResponse.voices[0]?.voice_id
}

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

    const voiceId = await getVoiceId(parsed.data.voiceId)
    if (!voiceId) {
      return NextResponse.json({ error: "No ElevenLabs voice available" }, { status: 500 })
    }

    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text: parsed.data.text,
      model_id: "eleven_multilingual_v2",
    })

    const audioBuffer = await streamToBuffer(audioStream)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Synthesize API error:", error)
    return NextResponse.json({ error: "API Failure" }, { status: 500 })
  }
}
