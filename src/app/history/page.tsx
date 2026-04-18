import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { getUserConversations } from "@/lib/services/conversations"
import Link from "next/link"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/Button"

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

  const conversations = await getUserConversations(session.user.id)

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
          conversations.map((conv: ConversationListItem) => (
            <Link key={conv.id} href={`/conversations/${conv.id}`}>
              <div className="group flex items-center justify-between rounded-2xl border border-[#b9c7df]/5 bg-[#131b2e] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3c0091]/10 text-[#d0bcff] transition-colors group-hover:bg-[#3c0091]/20">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#dae2fd]">{conv.title}</h4>
                    <p className="text-xs text-[#b9c7df]/40">
                      {conv._count.turns} turns • {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-[#b9c7df]/20 transition-colors group-hover:text-[#d0bcff]/40">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
