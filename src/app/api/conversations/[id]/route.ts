import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getConversationWithTurns } from "@/lib/services/conversations"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const conversation = await getConversationWithTurns(params.id, session.user.id)
  
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
  }

  return NextResponse.json(conversation)
}
