import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { getUserSpeakerProfiles } from "@/lib/services/speaker-profiles"
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
  if (!session?.user?.id) {
    redirect(`/login?redirectTo=${encodeURIComponent("/voices")}`)
  }

  let profiles: SpeakerProfileItem[] = []
  let loadError = false

  try {
    const speakerProfiles = await getUserSpeakerProfiles(session.user.id)
    profiles = speakerProfiles.map((profile) => ({
      id: profile.id,
      displayName: profile.displayName,
      sourceLanguage: profile.sourceLanguage,
      targetLanguage: profile.targetLanguage,
    }))
  } catch (error) {
    loadError = true
    console.error("Failed to load speaker profiles:", error)
  }

  return (
    <div className="space-y-6 px-4 pb-28 pt-5">
      <MobileHeader title="Voices" />

      <p className="-mt-2 text-sm leading-relaxed text-[#92a2c5]">
        Manage your custom vocal profiles for translations.
      </p>

      <Link href="/voices/new" className="block">
        <section className="rounded-[1.9rem] bg-[linear-gradient(135deg,#c998ff_0%,#b189ff_42%,#9b7dff_100%)] p-5 text-[#43235f] shadow-[0_18px_35px_rgba(167,124,255,0.28)]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xl font-semibold leading-tight">Train New Voice</p>
              <p className="max-w-[13rem] text-sm leading-relaxed text-[#5a3780]">
                Create a personal acoustic profile using a short guided sample.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/35 text-[#5a2c81]">
              <Plus size={22} />
            </div>
          </div>
        </section>
      </Link>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7e8cb1]">
          Saved Profiles
        </h2>
        <span className="rounded-full border border-white/8 bg-[#131d39] px-3 py-1 text-[11px] font-medium text-[#d7def7]">
          {profiles.length} Active
        </span>
      </div>

      {loadError ? (
        <div className="rounded-[1.8rem] border border-amber-300/20 bg-amber-300/10 px-6 py-10 text-center">
          <p className="text-lg font-semibold text-amber-100">Could not load voices</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-100/70">
            Your saved profiles are temporarily unavailable. Try refreshing in a moment.
          </p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-white/10 bg-[#131b2e] px-6 py-10 text-center">
          <p className="text-lg font-semibold text-[#eef1ff]">No saved voices yet</p>
          <p className="mt-2 text-sm leading-relaxed text-[#92a2c5]">
            Train your first profile so translations can sound more like you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {profiles.map((profile: SpeakerProfileItem, index) => (
            <article
              key={profile.id}
              className="rounded-[1.7rem] border border-white/6 bg-[#131b2e] p-4 shadow-[0_18px_35px_rgba(0,0,0,0.22)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#1f2b47] text-[#d0bcff]">
                <Mic2 size={20} />
              </div>

              <div className="mt-5 space-y-1">
                <h3 className="text-sm font-semibold text-[#eef1ff]">{profile.displayName}</h3>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#7e8cb1]">
                  {profile.sourceLanguage}
                </p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#8bd6b4]">
                  {profile.targetLanguage}
                </p>
              </div>

              <div className="mt-4">
                <span className="rounded-full bg-[#202c52] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d8cbff]">
                  {index === 0 ? "Selected" : "Saved"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
