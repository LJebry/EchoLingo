import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { getConversationWithTurns } from "@/lib/services/conversations"
import { Volume2 } from "lucide-react"

type ConversationTurnItem = {
  id: string
  sourceLanguage: string
  targetLanguage: string
  transcript: string
  translatedText: string | null
  audioUrl: string | null
}

export default async function ConversationDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect(`/login?redirectTo=${encodeURIComponent(`/conversations/${params.id}`)}`)

  const conversation = await getConversationWithTurns(params.id, session.user.id) as any
  if (!conversation) redirect("/history")

  return (
    <div className="space-y-6 px-4 pb-28 pt-5">
      <MobileHeader title={conversation.title} />

      <div className="space-y-8 pb-32">
        {conversation.turns.map((turn: ConversationTurnItem) => (
          <div key={turn.id} className="space-y-3">
            <div className="flex justify-start">
              <div className="max-w-[85%] space-y-1 rounded-t-3xl rounded-bl-sm rounded-br-3xl border border-outline-ghost/10 bg-surface-low p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-support/50">
                  {turn.sourceLanguage}
                </span>
                <p className="text-sm leading-relaxed text-on-surface">{turn.transcript}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[85%] space-y-2 rounded-t-3xl rounded-bl-3xl rounded-br-sm border border-pulse/10 bg-gradient-to-br from-pulse/20 to-pulse/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-pulse/70">
                    {turn.targetLanguage}
                  </span>
                  {turn.audioUrl && <Volume2 size={14} className="text-pulse" />}
                </div>
                <p className="font-bold leading-tight text-pulse">{turn.translatedText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
