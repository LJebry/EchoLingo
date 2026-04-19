"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mic2, Plus, Trash2, Loader2, Info, Check } from "lucide-react"
import { MobileHeader } from "@/components/layout/MobileHeader"

type SpeakerProfileItem = {
  id: string
  displayName: string
  sourceLanguage: string
  targetLanguage: string
}

export default function VoicesPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<SpeakerProfileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true)
        const response = await fetch("/api/speaker-profiles")
        if (response.status === 401) {
          router.push("/login?redirectTo=/voices")
          return
        }
        if (!response.ok) throw new Error("Failed to load profiles")
        const data = await response.json()
        setProfiles(data)
      } catch (err) {
        setError("Unable to load voice profiles.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this voice profile? This cannot be undone.")) return

    try {
      setDeletingId(id)
      const response = await fetch(`/api/speaker-profiles/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Deletion failed")
      
      setProfiles((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert("Failed to delete voice profile. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen space-y-6 bg-transparent px-4 pb-28 pt-5 text-on-surface">
      <MobileHeader title="Voices" />

      <p className="-mt-2 text-sm leading-relaxed text-support">
        Manage your custom universal vocal DNA profiles.
      </p>

      <Link href="/voices/new" className="block group">
        <section className="rounded-[1.9rem] bg-pulse p-6 text-on-pulse shadow-[0_18px_35px_rgba(var(--color-pulse),0.24)] transition-all hover:scale-[1.01] active:scale-[0.99]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-2xl font-bold leading-tight tracking-tight">Train Universal Voice</p>
              <p className="max-w-[15rem] text-sm font-medium leading-relaxed text-on-pulse/90">
                Create a personal acoustic clone using a guided multilingual sample.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-on-pulse/15 text-on-pulse shadow-inner">
              <Plus size={28} strokeWidth={3} />
            </div>
          </div>
        </section>
      </Link>

      <div className="flex items-center justify-between">
        <h2 className="ml-1 text-xs font-bold uppercase tracking-[0.25em] text-support">
          Active Profiles
        </h2>
        <span className="rounded-full border border-outline-ghost/10 bg-surface-high px-3 py-1 text-[10px] font-bold text-on-surface">
          {profiles.length} Ready
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
           <Loader2 className="animate-spin text-pulse" size={32} />
           <p className="text-xs font-bold uppercase tracking-widest text-support/50">Syncing profiles...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="rounded-[2.2rem] border border-dashed border-outline-ghost/15 bg-surface-low/70 px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-high text-support/50">
             <Mic2 size={28} />
          </div>
          <p className="text-lg font-bold text-on-surface">No custom voices yet</p>
          <p className="mx-auto mt-2 max-w-[15rem] text-sm leading-relaxed text-support">
            Train your first profile to make your translations sound like your own natural self.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {profiles.map((profile, index) => (
            <article
              key={profile.id}
              className="group relative rounded-[2rem] border border-outline-ghost/10 bg-surface-low p-5 shadow-xl transition-all hover:bg-surface-high"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(var(--color-pulse),0.16)_0%,rgba(var(--color-accent),0.12)_100%)] text-pulse">
                  <Mic2 size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-lg font-bold text-on-surface">{profile.displayName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-support">
                      DNA: {profile.sourceLanguage}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-outline-ghost/20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                      Universal Output
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(profile.id)}
                  disabled={deletingId === profile.id}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-400 opacity-0 transition-all hover:bg-red-500 hover:text-on-pulse disabled:opacity-50 group-hover:opacity-100"
                  aria-label="Delete profile"
                >
                  {deletingId === profile.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 rounded-full border border-pulse/15 bg-pulse/10 px-3 py-1.5">
                   <Check size={12} className="text-pulse" strokeWidth={3} />
                   <span className="text-[10px] font-bold uppercase tracking-wide text-pulse">Ready to use</span>
                </div>
                <p className="text-[10px] font-medium italic text-support/50">#{profile.id.slice(-6)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
      
      <div className="flex gap-3 rounded-2xl border border-outline-ghost/10 bg-surface-low/80 p-4">
         <Info size={20} className="shrink-0 text-pulse" />
         <p className="text-[11px] leading-relaxed text-support">
           Custom voices are powered by <b>ElevenLabs Instant Voice Cloning</b>. Training data is processed securely and can be removed at any time.
         </p>
      </div>
    </div>
  )
}
