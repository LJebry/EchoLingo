import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserSpeakerProfiles, createSpeakerProfile } from "@/lib/services/speaker-profiles"
import { cloneVoice } from "@/lib/services/elevenlabs"
import { z } from "zod"

const profileSchema = z.object({
  displayName: z.string().min(1, "Name is required"),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profiles = await getUserSpeakerProfiles(session.user.id)
  return NextResponse.json(profiles)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    
    const audioBlob = formData.get("audio") as Blob | null
    const displayName = formData.get("displayName") as string
    const sourceLanguage = formData.get("sourceLanguage") as string
    const targetLanguage = formData.get("targetLanguage") as string

    const validation = profileSchema.safeParse({
      displayName,
      sourceLanguage,
      targetLanguage,
    })

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    let elevenLabsVoiceId: string | undefined = undefined

    // If audio is provided, perform actual cloning
    if (audioBlob) {
      try {
        elevenLabsVoiceId = await cloneVoice(audioBlob, displayName)
      } catch (cloneError: any) {
        console.error("Cloning failed:", cloneError)
        return NextResponse.json({ error: cloneError.message || "Voice cloning failed" }, { status: 500 })
      }
    }

    const profile = await createSpeakerProfile({
      userId: session.user.id,
      displayName: validation.data.displayName,
      sourceLanguage: validation.data.sourceLanguage,
      targetLanguage: validation.data.targetLanguage,
      elevenLabsVoiceId
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error("API Profile Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
