"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRightLeft,
  Check,
  ChevronDown,
  Clipboard,
  Copy,
  Loader2,
  Mic,
  Send,
  Volume2,
  Settings2,
} from "lucide-react"
import { UserProfile } from "@/components/layout/UserProfile"
import { BrandLogo } from "@/components/layout/BrandLogo"
import { cn } from "@/lib/utils"

const MAX_CHARS = 5000
const EMPTY_TRANSLATION = "Your translated text will appear here."

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

type SpeakerProfile = {
  id: string
  displayName: string
  elevenLabsVoiceId?: string | null
}

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sourceSelectRef = useRef<HTMLSelectElement>(null)
  const targetSelectRef = useRef<HTMLSelectElement>(null)
  const [sourceLanguage, setSourceLanguage] = useState("English")
  const [targetLanguage, setTargetLanguage] = useState("Spanish")
  const [text, setText] = useState("")
  const [translatedText, setTranslatedText] = useState(EMPTY_TRANSLATION)
  const [loading, setLoading] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const [audioLoadingOriginal, setAudioLoadingOriginal] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioPlayingOriginal, setAudioPlayingOriginal] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [pastePending, setPastePending] = useState(false)
  const [availableProfiles, setAvailableProfiles] = useState<SpeakerProfile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState("default")

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await fetch("/api/speaker-profiles")
        if (response.ok) {
          const data = await response.json()
          setAvailableProfiles(data)
        }
      } catch (err) {
        console.error("Failed to fetch speaker profiles", err)
      }
    }
    fetchProfiles()
  }, [])

  const canTranslate = text.trim().length > 0 && !loading

  const helperText = useMemo(() => {
    if (loading) return "Translating..."
    if (error) return error
    return `${text.length} / ${MAX_CHARS}`
  }, [error, loading, text.length])

  const translate = async () => {
    if (!canTranslate) return

    try {
      setError("")
      setLoading(true)

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Translation request failed")
      }

      setTranslatedText(data.translatedText)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to translate right now"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    if (translatedText && translatedText !== EMPTY_TRANSLATION) {
      setText(translatedText)
      setTranslatedText(text || EMPTY_TRANSLATION)
    }
  }

  const openLanguagePicker = (selectRef: React.RefObject<HTMLSelectElement | null>) => {
    const select = selectRef.current
    if (!select) return

    if (typeof select.showPicker === "function") {
      select.showPicker()
      return
    }

    select.focus()
    select.click()
  }

  const copyTranslation = async () => {
    if (!translatedText || translatedText === EMPTY_TRANSLATION) return
    await navigator.clipboard.writeText(translatedText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  const pasteIntoInput = async () => {
    try {
      setPastePending(true)
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText.slice(0, MAX_CHARS))
      setError("")
      inputRef.current?.focus()
    } catch (pasteError) {
      setError(pasteError instanceof Error ? pasteError.message : "Unable to paste from clipboard.")
    } finally {
      setPastePending(false)
    }
  }

  const playOriginal = async () => {
    if (!text.trim()) return

    if (audioPlayingOriginal && audioRef.current) {
      audioRef.current.pause()
      setAudioPlayingOriginal(false)
      return
    }

    try {
      setAudioLoadingOriginal(true)
      setError("")

      const profile = availableProfiles.find(p => p.id === selectedProfileId)
      const voiceId = profile?.elevenLabsVoiceId || undefined

      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Unable to synthesize speech right now.")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setAudioPlayingOriginal(true)
      audio.onended = () => {
        setAudioPlayingOriginal(false)
        URL.revokeObjectURL(audioUrl)
        if (audioRef.current === audio) {
          audioRef.current = null
        }
      }
      audio.onpause = () => setAudioPlayingOriginal(false)

      await audio.play()
    } catch (playError) {
      setError(playError instanceof Error ? playError.message : "Unable to play audio.")
      setAudioPlayingOriginal(false)
    } finally {
      setAudioLoadingOriginal(false)
    }
  }

  const playTranslation = async () => {
    if (!translatedText || translatedText === EMPTY_TRANSLATION) return

    if (audioPlaying && audioRef.current) {
      audioRef.current.pause()
      setAudioPlaying(false)
      return
    }

    try {
      setAudioLoading(true)
      setError("")

      const profile = availableProfiles.find(p => p.id === selectedProfileId)
      const voiceId = profile?.elevenLabsVoiceId || undefined

      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translatedText,
          voiceId,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Unable to synthesize speech right now.")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onplay = () => setAudioPlaying(true)
      audio.onended = () => {
        setAudioPlaying(false)
        URL.revokeObjectURL(audioUrl)
        if (audioRef.current === audio) {
          audioRef.current = null
        }
      }
      audio.onpause = () => setAudioPlaying(false)

      await audio.play()
    } catch (playError) {
      setError(playError instanceof Error ? playError.message : "Unable to play translated audio.")
      setAudioPlaying(false)
    } finally {
      setAudioLoading(false)
    }
  }

  return (
    <main className="min-h-full bg-transparent text-on-surface">
      <div className="flex min-h-full flex-col px-4 pb-[6.75rem] pt-5 md:px-6 lg:px-8 lg:pb-28 lg:pt-8">
        <header className="flex items-center justify-between gap-3 pt-[max(0rem,env(safe-area-inset-top))]">
          <BrandLogo />

          <div className="flex items-center gap-3">
            <div className="relative group">
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Select Voice Profile"
              >
                <option value="default">Default AI Voice</option>
                {availableProfiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.displayName}</option>
                ))}
              </select>
              <div className="flex h-9 items-center gap-2 rounded-full border border-outline-ghost/10 bg-surface-high/80 pl-3 pr-4 text-xs font-semibold text-support transition-colors backdrop-blur-sm group-hover:bg-surface-highest">
                <Settings2 size={14} className="text-pulse" />
                <span className="max-w-[100px] truncate">
                  {availableProfiles.find(p => p.id === selectedProfileId)?.displayName || "Select Voice"}
                </span>
              </div>
            </div>

            <UserProfile />
          </div>
        </header>

        <section className="mx-auto mt-5 grid w-full grid-cols-[minmax(0,1fr)_2.75rem_minmax(0,1fr)] items-center gap-1.5 sm:gap-2 lg:mt-6 lg:max-w-3xl">
          <div className="min-w-0 overflow-hidden rounded-full border border-outline-ghost/10 bg-surface-low px-1.5 py-2 shadow-[0_18px_35px_rgba(0,0,0,0.12)] sm:px-2">
            <div className="relative">
              <select
                ref={sourceSelectRef}
                className="min-w-0 w-full appearance-none truncate rounded-full bg-surface-high px-3 py-3 pr-9 text-sm font-medium text-on-surface outline-none sm:px-4 sm:pr-12"
                value={sourceLanguage}
                onChange={(event) => setSourceLanguage(event.target.value)}
                aria-label="Source language"
              >
                {languages.map((lang) => (
                  <option key={`src-${lang}`} value={lang} className="bg-surface text-on-surface">
                    {lang}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openLanguagePicker(sourceSelectRef)}
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-support transition-colors hover:bg-pulse/10 hover:text-pulse sm:right-1.5"
                aria-label="Open source language options"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={swapLanguages}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-high text-pulse"
            aria-label="Swap languages"
          >
            <ArrowRightLeft size={18} />
          </button>

          <div className="min-w-0 overflow-hidden rounded-full border border-outline-ghost/10 bg-surface-low px-1.5 py-2 shadow-[0_18px_35px_rgba(0,0,0,0.12)] sm:px-2">
            <div className="relative">
              <select
                ref={targetSelectRef}
                className="min-w-0 w-full appearance-none truncate rounded-full bg-surface-high px-3 py-3 pr-9 text-sm font-medium text-on-surface outline-none sm:px-4 sm:pr-12"
                value={targetLanguage}
                onChange={(event) => setTargetLanguage(event.target.value)}
                aria-label="Target language"
              >
                {languages.map((lang) => (
                  <option key={`tgt-${lang}`} value={lang} className="bg-surface text-on-surface">
                    {lang}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => openLanguagePicker(targetSelectRef)}
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-support transition-colors hover:bg-pulse/10 hover:text-pulse sm:right-1.5"
                aria-label="Open target language options"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </section>

        <div className="mt-4 flex flex-1 flex-col gap-4 lg:min-h-0 lg:grid lg:grid-cols-2 lg:gap-6">
          <section className="flex flex-col rounded-[1.9rem] border border-outline-ghost/10 bg-surface-low p-4 shadow-[0_22px_45px_rgba(0,0,0,0.14)] lg:min-h-0 lg:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-support">
              Original
            </p>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, MAX_CHARS))}
              placeholder="Enter text to translate..."
              className="mt-3 min-h-[9rem] w-full resize-none bg-transparent text-base leading-relaxed text-on-surface outline-none placeholder:text-support lg:flex-1 lg:min-h-[22rem]"
            />

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={playOriginal}
                  disabled={audioLoadingOriginal || !text.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-high text-on-surface disabled:opacity-40"
                  aria-label="Play original audio"
                >
                  {audioLoadingOriginal ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                </button>

                <button
                  type="button"
                  onClick={pasteIntoInput}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-high text-on-surface"
                  aria-label="Paste into translation input"
                >
                  {pastePending ? <Loader2 size={16} className="animate-spin" /> : <Clipboard size={16} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setText("")
                    setError("")
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-high text-support"
                  aria-label="Clear input"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs ${error ? "text-red-400" : "text-support"}`}>
                  {helperText}
                </span>
                <button
                  type="button"
                  onClick={translate}
                  disabled={!canTranslate}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pulse text-on-pulse disabled:opacity-40"
                  aria-label="Translate text"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-[1.9rem] border border-outline-ghost/10 bg-surface-low p-4 shadow-[0_22px_45px_rgba(0,0,0,0.14)] lg:min-h-0 lg:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-support">
              Translation
            </p>
            <div className="mt-3 flex-1">
              <p className={cn(
                "min-h-[8rem] leading-tight lg:min-h-[22rem]",
                translatedText === EMPTY_TRANSLATION 
                  ? "text-base leading-relaxed text-support"
                  : "text-[1.65rem] text-on-surface"
              )}>
                {translatedText}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={playTranslation}
                disabled={audioLoading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-high text-on-surface"
                aria-label="Play translated audio"
              >
                {audioLoading ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyTranslation}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-high text-on-surface"
                  aria-label="Copy translated text"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-auto flex justify-center pt-8 lg:hidden">
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-pulse text-on-pulse shadow-[0_16px_35px_rgba(var(--color-pulse),0.3)]"
            aria-label="Focus translation input"
          >
            <Mic size={26} />
          </button>
        </div>
      </div>
    </main>
  )
}
