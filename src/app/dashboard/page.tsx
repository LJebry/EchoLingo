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

  const conversations = await getUserConversations(session.user.id)
  const profiles = await getUserSpeakerProfiles(session.user.id)

  return (
    <div className="space-y-8 px-4 pb-28 pt-5">
      <MobileHeader title="Dashboard" />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-surface">Recent Sessions</h3>
          <Link href="/history">
            <span className="text-sm text-pulse">View All</span>
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="space-y-4 rounded-3xl border border-dashed border-outline-ghost/20 bg-surface-low p-8 text-center">
            <p className="text-support/80">No conversations yet.</p>
            <Link href="/">
              <Button size="sm">Start Translating</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.slice(0, 3).map((conv: DashboardConversationItem) => (
              <Link key={conv.id} href={`/conversations/${conv.id}`}>
                <div className="flex items-center justify-between rounded-2xl border border-outline-ghost/10 bg-surface-low p-4 transition-colors hover:bg-surface-high">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pulse/20 text-pulse">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{conv.title}</h4>
                      <p className="text-xs text-support/70">
                        {conv._count.turns} turns • {new Date(conv.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-support/40"></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-surface">Speaker Profiles</h3>
          <Link href="/voices">
            <span className="text-sm text-pulse">Manage</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {profiles.slice(0, 2).map((profile: DashboardSpeakerProfileItem) => (
            <div key={profile.id} className="space-y-2 rounded-2xl border border-outline-ghost/10 bg-surface-low p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Mic2 size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">{profile.displayName}</h4>
                <p className="text-[10px] uppercase tracking-wider text-support/70">
                  {profile.sourceLanguage} → {profile.targetLanguage}
                </p>
              </div>
            </div>
          ))}
          <Link href="/voices/new" className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-outline-ghost/10 bg-surface-low/50 p-4 text-support/70 transition-colors hover:bg-surface-low">
            <Plus size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Add Voice</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
