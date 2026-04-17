"use client"

import Link from "next/link"
import { type ReactNode, useMemo, useRef, useState } from "react"
import {
  ArrowRightLeft,
  Check,
  Copy,
  Globe,
  Loader2,
  Mic,
  Clipboard,
  Send,
  Share2,
  Volume2,
} from "lucide-react"
import { cn } from "@/components/ui/Button"

const MAX_CHARS = 5000
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

function TranslationPanel({
  title,
  body,
  accentColor,
  borderClassName,
  cardClassName,
  align = "left",
  actions,
  isPlaying = false,
  children,
}: {
  title: string
  body: string
  accentColor: string
  borderClassName: string
  cardClassName: string
  align?: "left" | "right"
  actions?: ReactNode
  isPlaying?: boolean
  children?: ReactNode
}) {
  const isRightAligned = align === "right"

  return (
    <section className={cn("relative flex-1 rounded-[2rem] border px-5 pb-8 pt-6 shadow-[0_24px_60px_rgba(0,0,0,0.32)]", borderClassName)}>
      <div className="flex h-full flex-col justify-between">
        <div className={cn("flex items-center justify-between", isRightAligned && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-3", isRightAligned && "flex-row-reverse")}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg" style={{ backgroundColor: `${accentColor}24` }}>
              {isRightAligned ? "🌍" : "✍️"}
            </div>
            <div className={cn(isRightAligned && "text-right")}>
              <p className="text-sm font-semibold text-[#eef1ff]">{title}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8ea0c9]">
                {isRightAligned ? "Output" : "Input"}
              </p>
            </div>
          </div>

          {actions ? <div className={cn("flex items-center gap-2", isRightAligned && "flex-row-reverse")}>{actions}</div> : null}
        </div>

        <div className={cn("mt-8 rounded-[1.75rem] border p-5", cardClassName, isRightAligned && "text-right")}>
          <p className="text-sm uppercase tracking-[0.2em] text-[#7f91be]">
            {isRightAligned ? "Translation" : "Original"}
          </p>
          {children ? (
            <div className="mt-3">{children}</div>
          ) : (
            <p className="mt-3 min-h-[6rem] text-[1.45rem] leading-tight text-[#eef1ff] sm:text-[1.7rem]">
              {body}
            </p>
          )}
          <div className={cn("mt-6 flex items-end gap-2", isRightAligned ? "justify-end" : "justify-start")}>
            <div className={cn("h-14 w-2 origin-bottom rounded-full bg-[#79b3ff] scale-y-[0.42]", isPlaying && "animate-wave-bar [animation-delay:0ms]")} />
            <div className={cn("h-14 w-2 origin-bottom rounded-full bg-[#d0bcff] scale-y-[0.78]", isPlaying && "animate-wave-bar [animation-delay:150ms]")} />
            <div className={cn("h-14 w-2 origin-bottom rounded-full bg-[#79b3ff] scale-y-[0.56]", isPlaying && "animate-wave-bar [animation-delay:300ms]")} />
            <div className={cn("h-14 w-2 origin-bottom rounded-full bg-[#d0bcff] scale-y-100", isPlaying && "animate-wave-bar [animation-delay:450ms]")} />
            <div className={cn("h-14 w-2 origin-bottom rounded-full bg-[#79b3ff] scale-y-[0.64]", isPlaying && "animate-wave-bar [animation-delay:600ms]")} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [sourceLanguage, setSourceLanguage] = useState("English")
  const [targetLanguage, setTargetLanguage] = useState("Spanish")
  const [text, setText] = useState("")
  const [translatedText, setTranslatedText] = useState("Your translated text will appear here.")
  const [loading, setLoading] = useState(false)
  const [audioLoading, setAudioLoading] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioLoadingOriginal, setAudioLoadingOriginal] = useState(false)
  const [audioPlayingOriginal, setAudioPlayingOriginal] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [pastePending, setPastePending] = useState(false)

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
    if (translatedText && translatedText !== "Your translated text will appear here.") {
      setText(translatedText)
      setTranslatedText(text || "Your translated text will appear here.")
    }
  }

  const copyTranslation = async () => {
    if (!translatedText || translatedText === "Your translated text will appear here.") return
    await navigator.clipboard.writeText(translatedText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  const shareTranslation = async () => {
    if (!translatedText || translatedText === "Your translated text will appear here.") return

    if (navigator.share) {
      await navigator.share({
        title: "EchoLingo Translation",
        text: translatedText,
      })
      return
    }

    await navigator.clipboard.writeText(translatedText)
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

      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
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
    if (!translatedText || translatedText === "Your translated text will appear here.") return

    if (audioPlaying && audioRef.current) {
      audioRef.current.pause()
      setAudioPlaying(false)
      return
    }

    try {
      setAudioLoading(true)
      setError("")

      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translatedText,
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
    <main className="min-h-[calc(100dvh-5rem)] bg-[#020b23] text-white">
      <div className="relative min-h-[calc(100dvh-5rem)] w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.22),transparent_28%),linear-gradient(180deg,#09142f_0%,#050c1f_48%,#09142f_100%)]">
        <div className="flex items-center justify-between px-4 pt-6 sm:px-6 sm:pt-8">
          <div className="flex items-center gap-2 text-[#c8aefc]">
            <Globe size={26} />
            <h1 className="text-xl font-semibold">EchoLingo</h1>
          </div>

          <Link
            href="/login"
            className="inline-flex w-auto shrink-0 items-center justify-center rounded-full border border-[#44607b] bg-[#214461] px-5 py-3 text-sm font-medium text-[#e6e8f5] transition-all hover:bg-[#2a4e6f] active:scale-95"
          >
            Log In
          </Link>
        </div>

        <div className="relative flex min-h-[calc(100dvh-11rem)] flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8">
          <TranslationPanel
            title={sourceLanguage}
            body=""
            accentColor="#d0bcff"
            borderClassName="border-[#d0bcff]/10 bg-[linear-gradient(180deg,rgba(27,38,73,0.96),rgba(14,22,46,0.92))]"
            cardClassName="border-[#d0bcff]/10 bg-[#0e1731]/80"
            isPlaying={audioPlayingOriginal}
            actions={
              <>
                <button
                  type="button"
                  onClick={playOriginal}
                  disabled={audioLoadingOriginal || !text.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101936] text-[#d8def6] disabled:opacity-40"
                  aria-label="Play original audio"
                >
                  {audioLoadingOriginal ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                </button>
                <select
                  className="rounded-full border border-[#d0bcff]/20 bg-[#101936] px-4 py-3 text-sm text-[#eef1ff] outline-none"
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
                  onClick={pasteIntoInput}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101936] text-[#d8def6]"
                  aria-label="Paste into translation input"
                >
                  {pastePending ? <Loader2 size={18} className="animate-spin" /> : <Clipboard size={18} />}
                </button>
              </>
            }
          >
            <textarea
              ref={inputRef}
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, MAX_CHARS))}
              placeholder="Enter text to translate..."
              className="min-h-[8rem] w-full resize-none bg-transparent text-[1.45rem] leading-tight text-[#eef1ff] outline-none placeholder:text-[#69789e] sm:text-[1.7rem]"
            />
          </TranslationPanel>

          <div className="pointer-events-none relative z-20 -my-10 flex justify-center sm:-my-14">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(181,137,255,0.28)_0%,rgba(181,137,255,0.08)_48%,transparent_72%)]" />
              <div className="absolute inset-[14px] rounded-full border border-[#f0d5ff]/20 bg-[#120f2d]/90 shadow-[0_16px_40px_rgba(107,63,201,0.38)] sm:inset-[18px]" />
              <button
                type="button"
                onClick={swapLanguages}
                className="pointer-events-auto relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] text-[#2e0b5a] shadow-[0_12px_30px_rgba(164,92,255,0.45)] sm:h-20 sm:w-20"
                aria-label="Swap languages"
              >
                <ArrowRightLeft size={28} className="sm:h-9 sm:w-9" strokeWidth={2.6} />
              </button>
            </div>
          </div>

          <TranslationPanel
            title={targetLanguage}
            body={translatedText}
            accentColor="#8bd6b4"
            borderClassName="border-[#8bd6b4]/10 bg-[linear-gradient(180deg,rgba(13,24,45,0.92),rgba(20,40,53,0.96))]"
            cardClassName="border-[#8bd6b4]/10 bg-[#0d1c2c]/80"
            align="right"
            isPlaying={audioPlaying}
            actions={
              <>
                <button
                  type="button"
                  onClick={playTranslation}
                  disabled={audioLoading}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101936] text-[#d8def6]"
                  aria-label="Play translated audio"
                >
                  {audioLoading ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                </button>
                <button
                  type="button"
                  onClick={copyTranslation}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101936] text-[#d8def6]"
                  aria-label="Copy translated text"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <button
                  type="button"
                  onClick={shareTranslation}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101936] text-[#d8def6]"
                  aria-label="Share translated text"
                >
                  <Share2 size={18} />
                </button>
                <select
                  className="rounded-full border border-[#8bd6b4]/20 bg-[#101936] px-4 py-3 text-sm text-[#eef1ff] outline-none"
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
              </>
            }
          />

          <div className="mt-5 flex items-center justify-between gap-3 rounded-[2rem] border border-[#b9c7df]/10 bg-[#0d1734]/85 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.24)]">
            <span className={cn("text-sm", error ? "text-red-300" : "text-[#9fb0d4]")}>{helperText}</span>
            <button
              type="button"
              onClick={translate}
              disabled={!canTranslate}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] px-5 py-3 text-sm font-semibold text-[#2e0b5a] disabled:opacity-40"
              aria-label="Translate text"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              <span>Translate</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
