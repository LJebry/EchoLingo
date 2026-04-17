import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { getConversationWithTurns } from "@/lib/services/conversations"
import { Volume2 } from "lucide-react"

export default async function ConversationDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const conversation = await getConversationWithTurns(params.id, session.user.id)
  if (!conversation) redirect("/conversations")

  return (
    <div className="space-y-6">
      <MobileHeader title={conversation.title} />

      <div className="space-y-8 pb-32">
        {conversation.turns.map((turn) => (
          <div key={turn.id} className="space-y-3">
            {/* Source */}
            <div className="flex justify-start">
              <div className="max-w-[85%] p-4 rounded-t-3xl rounded-br-3xl rounded-bl-sm bg-[#131b2e] border border-[#b9c7df]/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#b9c7df]/30">
                  {turn.sourceLanguage}
                </span>
                <p className="text-[#dae2fd] text-sm leading-relaxed">{turn.transcript}</p>
              </div>
            </div>

            {/* Translation */}
            <div className="flex justify-end">
              <div className="max-w-[85%] p-4 rounded-t-3xl rounded-bl-3xl rounded-br-sm bg-gradient-to-br from-[#d0bcff]/20 to-[#3c0091]/10 border border-[#d0bcff]/10 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d0bcff]/60">
                    {turn.targetLanguage}
                  </span>
                  {turn.audioUrl && <Volume2 size={14} className="text-[#d0bcff]" />}
                </div>
                <p className="text-[#d0bcff] font-bold leading-tight">{turn.translatedText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Persistent Input Overlay could go here */}
    </div>
  )
}
