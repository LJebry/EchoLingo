import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deleteSpeakerProfile } from "@/lib/services/speaker-profiles"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = params
    await deleteSpeakerProfile(id, session.user.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("API Profile Delete Error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
