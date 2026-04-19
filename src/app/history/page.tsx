import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { getUserConversations } from "@/lib/services/conversations"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ConversationHistoryList } from "@/components/conversation/ConversationHistoryList"

type ConversationListItem = {
  id: string
  title: string
  updatedAt: Date
  _count: {
    turns: number
  }
}

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect(`/login?redirectTo=${encodeURIComponent("/history")}`)
  }

  const conversations = await getUserConversations(session.user.id) as any
  const conversationItems = conversations.map((conv: ConversationListItem) => ({
    id: conv.id,
    title: conv.title,
    updatedAt: conv.updatedAt.toISOString(),
    turns: conv._count.turns,
  }))

  return (
    <div className="space-y-6 px-4 pb-28 pt-5">
      <MobileHeader title="History" />

      <div className="space-y-3">
        <div className="space-y-1 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7e8cb1]">Latest conversations</p>
          <p className="text-sm text-[#b9c7df]/40">Your newest saved sessions appear first.</p>
        </div>

        {conversations.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#b9c7df]/10 bg-[#131b2e] px-6 py-10 text-center">
            <p className="text-lg font-semibold text-[#dae2fd]">No history yet</p>
            <p className="mt-2 text-sm leading-relaxed text-[#b9c7df]/40">
              Saved conversations will show up here after you complete a translation flow.
            </p>
            <Link href="/" className="mt-6 inline-block">
              <Button size="sm">Start Translating</Button>
            </Link>
          </div>
        ) : (
          <ConversationHistoryList conversations={conversationItems} />
        )}
      </div>
    </div>
  )
}
