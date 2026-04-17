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

export default async function ConversationsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const conversations = await getUserConversations(session.user.id)

  return (
    <div className="space-y-6">
      <MobileHeader title="History" />

      <div className="space-y-3">
        {conversations.length === 0 ? (
          <p className="text-[#b9c7df]/40 text-center py-12">No history found.</p>
        ) : (
          conversations.map((conv: ConversationListItem) => (
            <Link key={conv.id} href={`/conversations/${conv.id}`}>
              <div className="p-4 rounded-2xl bg-[#131b2e] border border-[#b9c7df]/5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#3c0091]/10 flex items-center justify-center text-[#d0bcff] group-hover:bg-[#3c0091]/20 transition-colors">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#dae2fd]">{conv.title}</h4>
                    <p className="text-xs text-[#b9c7df]/40">
                      {conv._count.turns} turns • {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-[#b9c7df]/20 group-hover:text-[#d0bcff]/40 transition-colors">
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
