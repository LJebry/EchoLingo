import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserSpeakerProfiles, createSpeakerProfile } from "@/lib/services/speaker-profiles"
import { z } from "zod"

const profileSchema = z.object({
  displayName: z.string().min(1, "Name is required"),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  elevenLabsVoiceId: z.string().optional(),
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
    const body = await req.json()
    const validation = profileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const profile = await createSpeakerProfile({
      userId: session.user.id,
      ...validation.data
    })
    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
