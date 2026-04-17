import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserSpeakerProfileById, updateSpeakerProfile } from "@/lib/services/speaker-profiles"
import { z } from "zod"

const profileSchema = z.object({
  displayName: z.string().min(1, "Name is required"),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  elevenLabsVoiceId: z.string().optional(),
})

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profile = await getUserSpeakerProfileById(params.id, session.user.id)
  if (!profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(profile)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const existingProfile = await getUserSpeakerProfileById(params.id, session.user.id)
  if (!existingProfile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const body = await req.json()
    const validation = profileSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const profile = await updateSpeakerProfile(params.id, session.user.id, validation.data)
    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
