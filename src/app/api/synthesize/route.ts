import { NextResponse } from "next/server"
import { Readable } from "node:stream"
import elevenlabs from "@/lib/elevenlabs"
import { z } from "zod"

const synthesizeSchema = z.object({
  text: z.string().trim().min(1),
  voiceId: z.string().trim().optional(),
})

async function streamToBuffer(stream: Readable | ReadableStream<Uint8Array>) {
  const readable = stream instanceof Readable ? stream : Readable.fromWeb(stream as any)
  const chunks: Buffer[] = []

  for await (const chunk of readable) {
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

  try {
    const voiceResponse = await elevenlabs.voices.getAll()
    const firstVoice = voiceResponse.voices?.[0] as
      | {
          voiceId?: string
          voice_id?: string
        }
      | undefined
    const firstVoiceId = firstVoice?.voiceId ?? firstVoice?.voice_id

    if (!firstVoiceId) {
      console.error("ElevenLabs: No voices found in account.")
      return null
    }
    return firstVoiceId
  } catch (error) {
    console.error("ElevenLabs: Failed to fetch voices:", error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key is not configured" },
        { status: 500 }
      )
    }

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
      return NextResponse.json({ error: "No ElevenLabs voice available or found" }, { status: 500 })
    }

    console.log(`ElevenLabs: Synthesizing with voiceId: ${voiceId}`)

    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text: parsed.data.text,
      modelId: "eleven_multilingual_v2",
    })

    const audioBuffer = await streamToBuffer(audioStream)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    })
  } catch (error: any) {
    console.error("Synthesize API error details:", error)
    
    // Check for specific ElevenLabs errors if possible
    const status = error?.status || 500
    const message = error?.message || "Speech synthesis failed"
    
    return NextResponse.json({ error: message }, { status })
  }
}
