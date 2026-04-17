"use client"

import { useMemo, useRef, useState } from "react"
import {
  Globe,
  ChevronDown,
  ArrowRightLeft,
  X,
  Volume2,
  Copy,
  Share2,
  Mic,
  Languages,
  MessageCircleMore,
  Bot,
  History,
} from "lucide-react"
import { LoginLinkButton } from "@/components/auth/LoginLinkButton"

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

export default function Home() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [sourceLanguage, setSourceLanguage] = useState("English")
  const [targetLanguage, setTargetLanguage] = useState("Spanish")
  const [text, setText] = useState("")
  const [translatedText, setTranslatedText] = useState("Introduce el texto a traducir...")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    if (translatedText && translatedText !== "Introduce el texto a traducir...") {
      setText(translatedText)
      setTranslatedText(text || "Introduce el texto a traducir...")
    }
  }

  const copyTranslation = async () => {
    if (!translatedText || translatedText === "Introduce el texto a traducir...") return
    await navigator.clipboard.writeText(translatedText)
  }

  const shareTranslation = async () => {
    if (!translatedText || translatedText === "Introduce el texto a traducir...") return

    if (navigator.share) {
      await navigator.share({
        title: "EchoLingo Translation",
        text: translatedText,
      })
      return
    }

    await navigator.clipboard.writeText(translatedText)
  }

  const clearInput = () => {
    setText("")
    setError("")
    inputRef.current?.focus()
  }

  const focusInputCard = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement
    if (target.closest("button") || target.closest("select")) return
    inputRef.current?.focus()
  }

  return (
    <main className="min-h-screen bg-[#000f3d] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-6 pt-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full">
              <Globe className="h-9 w-9 text-[#c7afff]" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-[28px] font-semibold tracking-tight text-[#c7afff]">EchoLingo</h1>
              <p className="text-xs text-[#9ea8c7]">Translate now, save later</p>
            </div>
          </div>

          <LoginLinkButton
            label="Log In"
            className="w-auto shrink-0 border-[#44607b] bg-[#214461] px-5 py-3 text-sm font-medium text-[#e6e8f5] hover:bg-[#2a4e6f]"
          />
        </header>

        <section className="mt-12 rounded-[800px] bg-[#222d52] px-5 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center">
            <label className="flex items-center justify-center gap-2 text-[#e6e8f5]">
              <span className="sr-only">Source language</span>
              <select
                className="w-full bg-transparent text-center text-[20px] font-medium outline-none"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={`src-${lang}`} value={lang} className="bg-[#222d52] text-white">
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-5 w-5" />
            </label>

            <button
              onClick={swapLanguages}
              className="mx-3 flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#283458] shadow-inner"
              aria-label="Swap languages"
            >
              <ArrowRightLeft className="h-9 w-9 text-[#c7afff]" strokeWidth={2.2} />
            </button>

            <label className="flex items-center justify-center gap-2 text-[#e6e8f5]">
              <span className="sr-only">Target language</span>
              <select
                className="w-full bg-transparent text-center text-[20px] font-medium outline-none"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={`tgt-${lang}`} value={lang} className="bg-[#222d52] text-white">
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronDown className="h-5 w-5" />
            </label>
          </div>
        </section>

        <section
          className="mt-10 cursor-text rounded-[34px] bg-[#0f1c49] px-8 pb-8 pt-10 shadow-[0_18px_35px_rgba(0,0,0,0.22)]"
          onClick={focusInputCard}
        >
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Enter text to translate..."
            className="pointer-events-auto relative z-10 h-52 w-full resize-none bg-transparent text-[24px] leading-snug text-[#dae2fd] placeholder:text-[#737598] outline-none"
          />

          <div className="mt-6 flex items-center justify-between">
            <button onClick={clearInput} className="text-[#c7c3de]" aria-label="Clear text">
              <X className="h-10 w-10" strokeWidth={2.2} />
            </button>

            <button
              onClick={translate}
              disabled={!canTranslate}
              className="rounded-full bg-gradient-to-br from-[#d0bcff] to-[#7a5ac9] px-6 py-2 text-sm font-semibold text-[#3c0091] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Translating" : "Translate"}
            </button>

            <span className={`text-[15px] ${error ? "text-red-300" : "text-[#777995]"}`}>{helperText}</span>
          </div>
        </section>

        <section className="mt-8 rounded-[34px] bg-[#232d52] px-8 pb-12 pt-10 shadow-[0_18px_35px_rgba(0,0,0,0.22)]">
          <p className="max-w-[270px] text-[28px] leading-[1.15] text-[#c7afff]">{translatedText}</p>

          <div className="mt-24 border-t border-[#2e395f]" />

          <div className="mt-8 flex items-center justify-between">
            <button className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#313b61]" aria-label="Play translation audio">
              <Volume2 className="h-11 w-11 text-[#c7afff]" strokeWidth={2.2} />
            </button>

            <div className="flex items-center gap-8 text-[#d1c9e2]">
              <button onClick={copyTranslation} aria-label="Copy translation">
                <Copy className="h-8 w-8" strokeWidth={2.2} />
              </button>
              <button onClick={shareTranslation} aria-label="Share translation">
                <Share2 className="h-8 w-8" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </section>

        <section className="relative mt-8 flex flex-1 items-center justify-center pb-24 md:pb-8">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(8,16,50,0.75)_0%,rgba(6,14,47,0.95)_65%,rgba(4,12,45,1)_100%)]">
            <button className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#b997ff] shadow-[0_10px_30px_rgba(185,151,255,0.18)]" aria-label="Voice input">
              <Mic className="h-8 w-8 text-[#3f00a8]" strokeWidth={2.4} />
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
