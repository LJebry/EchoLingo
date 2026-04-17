"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mic2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/Button"

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Hindi",
  "Japanese",
]

interface VoiceProfilePageProps {
  mode?: "create" | "edit"
  profileId?: string
  initialValues?: {
    displayName: string
    sourceLanguage: string
    targetLanguage: string
    elevenLabsVoiceId?: string | null
  }
}

export function VoiceProfilePage({
  mode = "create",
  profileId,
  initialValues,
}: VoiceProfilePageProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(initialValues?.displayName ?? "")
  const [sourceLanguage, setSourceLanguage] = useState(initialValues?.sourceLanguage ?? "English")
  const [targetLanguage, setTargetLanguage] = useState(initialValues?.targetLanguage ?? "Spanish")
  const [elevenLabsVoiceId, setElevenLabsVoiceId] = useState(initialValues?.elevenLabsVoiceId ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const canSubmit =
    displayName.trim().length > 0 &&
    sourceLanguage.trim().length > 0 &&
    targetLanguage.trim().length > 0 &&
    !isSubmitting

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    try {
      setIsSubmitting(true)
      setError("")

      const response = await fetch(mode === "edit" && profileId ? `/api/speaker-profiles/${profileId}` : "/api/speaker-profiles", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          sourceLanguage,
          targetLanguage,
          elevenLabsVoiceId: elevenLabsVoiceId.trim() || undefined,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || `Unable to ${mode === "edit" ? "update" : "create"} voice profile.`)
      }

      router.push("/voices")
      router.refresh()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : `Unable to ${mode === "edit" ? "update" : "create"} voice profile.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-[#020b23] text-white">
      <div className="relative min-h-[calc(100dvh-5rem)] w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.22),transparent_28%),linear-gradient(180deg,#09142f_0%,#050c1f_48%,#09142f_100%)]">
        <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-2xl flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8">
          <section className="rounded-[2rem] border border-[#d0bcff]/10 bg-[linear-gradient(180deg,rgba(27,38,73,0.96),rgba(14,22,46,0.92))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8ea0c9]">Voice Profile</p>
                <h1 className="text-3xl font-semibold tracking-tight text-[#eef1ff]">
                  {mode === "edit" ? "Update your speaking identity" : "Create a speaking identity"}
                </h1>
                <p className="max-w-lg text-sm leading-relaxed text-[#9fb0d4]">
                  Set the name, language pair, and optional ElevenLabs voice ID for a reusable translated voice.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d0bcff]/15 text-[#d0bcff]">
                <Mic2 size={26} />
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-[2rem] border border-[#b9c7df]/10 bg-[#0d1734]/85 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.24)]">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8ea0c9]">Display Name</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Conference Host"
                  className="w-full rounded-[1.2rem] border border-[#d0bcff]/10 bg-[#091127] px-4 py-3 text-[#eef1ff] outline-none placeholder:text-[#69789e]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8ea0c9]">Source Language</span>
                <select
                  value={sourceLanguage}
                  onChange={(event) => setSourceLanguage(event.target.value)}
                  className="w-full rounded-[1.2rem] border border-[#d0bcff]/10 bg-[#091127] px-4 py-3 text-[#eef1ff] outline-none"
                >
                  {languages.map((language) => (
                    <option key={`source-${language}`} value={language} className="bg-[#091127] text-white">
                      {language}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8ea0c9]">Target Language</span>
                <select
                  value={targetLanguage}
                  onChange={(event) => setTargetLanguage(event.target.value)}
                  className="w-full rounded-[1.2rem] border border-[#d0bcff]/10 bg-[#091127] px-4 py-3 text-[#eef1ff] outline-none"
                >
                  {languages.map((language) => (
                    <option key={`target-${language}`} value={language} className="bg-[#091127] text-white">
                      {language}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8ea0c9]">ElevenLabs Voice ID</span>
                <input
                  value={elevenLabsVoiceId}
                  onChange={(event) => setElevenLabsVoiceId(event.target.value)}
                  placeholder="Optional voice id for text-to-speech playback"
                  className="w-full rounded-[1.2rem] border border-[#d0bcff]/10 bg-[#091127] px-4 py-3 text-[#eef1ff] outline-none placeholder:text-[#69789e]"
                />
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-[#8bd6b4]/10 bg-[#102133] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#8bd6b4]/15 text-[#8bd6b4]">
                  <Sparkles size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#dff7eb]">How this profile is used</p>
                  <p className="text-sm leading-relaxed text-[#9ec8b7]">
                    Conversation playback can use this profile’s language pair and optional ElevenLabs voice ID for spoken translation output.
                  </p>
                </div>
              </div>
            </div>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => router.push("/voices")}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : mode === "edit" ? (
                  "Save Changes"
                ) : (
                  "Create Profile"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
