import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserConversations, createConversation } from "@/lib/services/conversations"
import { z } from "zod"

const conversationSchema = z.object({
  title: z.string().min(1, "Title is required"),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversations = await getUserConversations(session.user.id)
  return NextResponse.json(conversations)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const validation = conversationSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 })
    }

    const conversation = await createConversation(session.user.id, validation.data.title)
    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
