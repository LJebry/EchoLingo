import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { getUserSpeakerProfiles } from "@/lib/services/speaker-profiles"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Mic2, Plus } from "lucide-react"

type SpeakerProfileItem = {
  id: string
  displayName: string
  sourceLanguage: string
  targetLanguage: string
}

export default async function VoicesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const profiles = await getUserSpeakerProfiles(session.user.id)

  return (
    <div className="space-y-6">
      <MobileHeader title="My Voices" />

      <div className="grid gap-4">
        {profiles.map((profile: SpeakerProfileItem) => (
          <div key={profile.id} className="p-5 rounded-[2rem] bg-[#131b2e] border border-[#b9c7df]/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#8bd6b4]/10 flex items-center justify-center text-[#8bd6b4]">
                <Mic2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#dae2fd]">{profile.displayName}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#b9c7df]/40">{profile.sourceLanguage}</span>
                  <span className="text-[10px] text-[#b9c7df]/20">→</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d0bcff]/60">{profile.targetLanguage}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
        ))}

        <Link href="/voices/new">
          <Button variant="ghost" className="w-full border-dashed border-[#b9c7df]/20 h-24 rounded-[2rem]">
            <Plus size={24} className="mr-2" />
            Create New Profile
          </Button>
        </Link>
      </div>
    </div>
  )
}
