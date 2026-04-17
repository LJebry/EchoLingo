import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { getUserConversations } from "@/lib/services/conversations"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

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
  if (!session?.user?.id) redirect("/login")

  const conversations = await getUserConversations(session.user.id)

  return (
    <div className="space-y-6">
      <MobileHeader title="History" />

      <div className="space-y-3">
        {conversations.length === 0 ? (
          <p className="py-12 text-center text-[#b9c7df]/40">No history found.</p>
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
