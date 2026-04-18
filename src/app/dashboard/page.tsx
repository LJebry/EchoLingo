import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { getUserConversations } from "@/lib/services/conversations"
import { getUserSpeakerProfiles } from "@/lib/services/speaker-profiles"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { MessageSquare, Mic2, Plus } from "lucide-react"

type DashboardConversationItem = {
  id: string
  title: string
  updatedAt: Date
  _count: {
    turns: number
  }
}

type DashboardSpeakerProfileItem = {
  id: string
  displayName: string
  sourceLanguage: string
  targetLanguage: string
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const conversations = await getUserConversations(session.user.id) as any
  const profiles = await getUserSpeakerProfiles(session.user.id) as any

  return (
    <div className="space-y-8 px-4 pb-28 pt-5">
      <MobileHeader title="Dashboard" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#dae2fd]">Recent Sessions</h3>
          <Link href="/history">
            <span className="text-sm text-[#d0bcff]">View All</span>
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#131b2e] border border-dashed border-[#b9c7df]/20 text-center space-y-4">
            <p className="text-[#b9c7df]/60">No conversations yet.</p>
            <Link href="/">
              <Button size="sm">Start Translating</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.slice(0, 3).map((conv: DashboardConversationItem) => (
              <Link key={conv.id} href={`/conversations/${conv.id}`}>
                <div className="p-4 rounded-2xl bg-[#131b2e] border border-[#b9c7df]/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#3c0091]/20 flex items-center justify-center text-[#d0bcff]">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#dae2fd]">{conv.title}</h4>
                      <p className="text-xs text-[#b9c7df]/40">
                        {conv._count.turns} turns • {new Date(conv.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-[#b9c7df]/20"></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#dae2fd]">Speaker Profiles</h3>
          <Link href="/voices">
            <span className="text-sm text-[#d0bcff]">Manage</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {profiles.slice(0, 2).map((profile: DashboardSpeakerProfileItem) => (
            <div key={profile.id} className="p-4 rounded-2xl bg-[#131b2e] border border-[#b9c7df]/5 space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#8bd6b4]/20 flex items-center justify-center text-[#8bd6b4]">
                <Mic2 size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#dae2fd]">{profile.displayName}</h4>
                <p className="text-[10px] text-[#b9c7df]/40 uppercase tracking-wider">
                  {profile.sourceLanguage} → {profile.targetLanguage}
                </p>
              </div>
            </div>
          ))}
          <Link href="/voices/new" className="p-4 rounded-2xl bg-[#131b2e]/50 border border-dashed border-[#b9c7df]/10 flex flex-col items-center justify-center gap-2 text-[#b9c7df]/40">
            <Plus size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Add Voice</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
