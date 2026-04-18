"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRightLeft,
  Check,
  Clipboard,
  Copy,
  Globe,
  Loader2,
  Mic,
  Send,
  Volume2,
  Settings2,
} from "lucide-react"
import { UserProfile } from "@/components/layout/UserProfile"

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
    <main className="min-h-full bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.22),transparent_28%),linear-gradient(180deg,#09142f_0%,#050c1f_48%,#09142f_100%)] text-white">
      <div className="flex min-h-full flex-col px-4 pb-[6.75rem] pt-5 md:px-6 lg:px-8 lg:pb-28 lg:pt-8">
        <header className="sticky top-0 z-40 -mx-4 flex items-center justify-between gap-3 border-b border-white/5 bg-[#09142f]/95 px-4 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-md md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center gap-2 text-[#c8aefc]">
            <Globe size={18} />
            <h1 className="text-sm font-semibold tracking-tight">EchoLingo</h1>
          </div>

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
              <div className="flex h-9 items-center gap-2 rounded-full bg-[#162242] pl-3 pr-4 text-xs font-semibold text-[#8ea0c9] border border-white/10 group-hover:bg-[#1f2b47] transition-colors">
                <Settings2 size={14} className="text-[#c8aefc]" />
                <span className="max-w-[100px] truncate">
                  {availableProfiles.find(p => p.id === selectedProfileId)?.displayName || "Select Voice"}
                </span>
              </div>
            </div>

            <UserProfile />
          </div>
        </header>

        <section className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-full border border-white/8 bg-[#151f3c] px-3 py-2.5 shadow-[0_18px_35px_rgba(0,0,0,0.22)] lg:mt-6 lg:max-w-3xl">
          <select
            className="max-w-[110px] sm:max-w-none min-w-0 flex-1 appearance-none rounded-full bg-[#202b4d] px-3 sm:px-4 py-3 text-sm font-medium text-[#eef1ff] outline-none"
            value={sourceLanguage}
            onChange={(event) => setSourceLanguage(event.target.value)}
            aria-label="Source language"
          >
            {languages.map((lang) => (
              <option key={`src-${lang}`} value={lang} className="bg-[#132041] text-white">
                {lang}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={swapLanguages}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#202b4d] text-[#c8aefc]"
            aria-label="Swap languages"
          >
            <ArrowRightLeft size={18} />
          </button>

          <select
            className="min-w-0 flex-1 appearance-none rounded-full bg-[#202b4d] px-4 py-3 text-sm font-medium text-[#eef1ff] outline-none"
            value={targetLanguage}
            onChange={(event) => setTargetLanguage(event.target.value)}
            aria-label="Target language"
          >
            {languages.map((lang) => (
              <option key={`tgt-${lang}`} value={lang} className="bg-[#132041] text-white">
                {lang}
              </option>
            ))}
          </select>
        </section>

        <div className="mt-4 flex flex-1 flex-col gap-4 lg:min-h-0 lg:grid lg:grid-cols-2 lg:gap-6">
          <section className="flex flex-col rounded-[1.9rem] border border-white/6 bg-[#121b33] p-4 shadow-[0_22px_45px_rgba(0,0,0,0.24)] lg:min-h-0 lg:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7e8cb1]">
              Original
            </p>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, MAX_CHARS))}
              placeholder="Enter text to translate..."
              className="mt-3 min-h-[9rem] w-full resize-none bg-transparent text-base leading-relaxed text-[#eef1ff] outline-none placeholder:text-[#6f7fa8] lg:flex-1 lg:min-h-[22rem]"
            />

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={playOriginal}
                  disabled={audioLoadingOriginal || !text.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202b4d] text-[#d7def7] disabled:opacity-40"
                  aria-label="Play original audio"
                >
                  {audioLoadingOriginal ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
                </button>

                <button
                  type="button"
                  onClick={pasteIntoInput}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202b4d] text-[#d7def7]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202b4d] text-[#9fb0d4]"
                  aria-label="Clear input"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs ${error ? "text-red-300" : "text-[#7e8cb1]"}`}>
                  {helperText}
                </span>
                <button
                  type="button"
                  onClick={translate}
                  disabled={!canTranslate}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] text-[#2e0b5a] disabled:opacity-40"
                  aria-label="Translate text"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-[1.9rem] border border-white/6 bg-[#121b33] p-4 shadow-[0_22px_45px_rgba(0,0,0,0.24)] lg:min-h-0 lg:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7e8cb1]">
              Translation
            </p>
            <div className="mt-3 flex-1">
              <p className="min-h-[8rem] text-[1.65rem] leading-tight text-[#eef1ff] lg:min-h-[22rem]">
                {translatedText}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={playTranslation}
                disabled={audioLoading}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202b4d] text-[#d7def7]"
                aria-label="Play translated audio"
              >
                {audioLoading ? <Loader2 size={16} className="animate-spin" /> : <Volume2 size={16} />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyTranslation}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202b4d] text-[#d7def7]"
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
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] text-[#2e0b5a] shadow-[0_16px_35px_rgba(164,92,255,0.4)]"
            aria-label="Focus translation input"
          >
            <Mic size={26} />
          </button>
        </div>
      </div>
    </main>
  )
}
