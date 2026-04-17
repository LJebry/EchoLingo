"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRightLeft,
  Check,
  Globe,
  Keyboard,
  Loader2,
  Mic,
  Send,
  Volume2,
} from "lucide-react"
import AudioRecorder from "@/components/AudioRecorder"
import { cn } from "@/components/ui/Button"

type SpeakerKey = "person1" | "person2"

type SpeakerConfig = {
  key: SpeakerKey
  name: string
  sourceLanguage: string
  targetLanguage: string
  accentColor: string
  borderColor: string
  panelClassName: string
  cardClassName: string
  wavePrimary: string
  waveSecondary: string
  align: "left" | "right"
  upsideDown?: boolean
}

type ConversationTurn = {
  id: string
  speakerKey: SpeakerKey
  transcript: string
  translatedText: string
  audioUrl?: string | null
  saved: boolean
}

type PanelCopy = {
  heading: string
  body: string
  status: string
  audioUrl?: string | null
  statusVariant: "saved" | "audio" | "waiting"
}

const speakers: SpeakerConfig[] = [
  {
    key: "person2",
    name: "Person 2",
    sourceLanguage: "Spanish",
    targetLanguage: "English (US)",
    accentColor: "#8bd6b4",
    borderColor: "border-[#8bd6b4]/10",
    panelClassName:
      "bg-[linear-gradient(180deg,rgba(13,24,45,0.92),rgba(20,40,53,0.96))]",
    cardClassName: "border-[#8bd6b4]/10 bg-[#0d1c2c]/80",
    wavePrimary: "bg-[#8bd6b4]",
    waveSecondary: "bg-[#d0bcff]",
    align: "right",
    upsideDown: true,
  },
  {
    key: "person1",
    name: "Person 1",
    sourceLanguage: "English (US)",
    targetLanguage: "Spanish",
    accentColor: "#d0bcff",
    borderColor: "border-[#d0bcff]/10",
    panelClassName:
      "bg-[linear-gradient(180deg,rgba(27,38,73,0.96),rgba(14,22,46,0.92))]",
    cardClassName: "border-[#d0bcff]/10 bg-[#0e1731]/80",
    wavePrimary: "bg-[#79b3ff]",
    waveSecondary: "bg-[#d0bcff]",
    align: "left",
  },
]

function buildConversationTitle() {
  return `Conversation ${new Date().toLocaleString()}`
}

function playAudio(url?: string | null) {
  if (!url) return

  const audio = new Audio(url)
  void audio.play()
}

function getPanelCopy(turns: ConversationTurn[], speaker: SpeakerConfig): PanelCopy {
  const ownTurn = [...turns].reverse().find((turn) => turn.speakerKey === speaker.key)
  const heardTurn = [...turns].reverse().find((turn) => turn.speakerKey !== speaker.key)

  if (ownTurn) {
    return {
      heading: "Original",
      body: ownTurn.transcript,
      status: ownTurn.saved ? "Saved to history" : "Guest mode",
      audioUrl: ownTurn.audioUrl,
      statusVariant: ownTurn.saved ? "saved" : "audio",
    }
  }

  if (heardTurn) {
    return {
      heading: "Translation",
      body: heardTurn.translatedText,
      status: "Latest reply",
      audioUrl: heardTurn.audioUrl,
      statusVariant: "audio",
    }
  }

  return {
    heading: speaker.key === "person1" ? "Original" : "Translation",
    body: speaker.key === "person1" ? "Tap the mic or type a line to start." : "The translated reply appears here.",
    status: "Waiting",
    audioUrl: null,
    statusVariant: "waiting",
  }
}

function SpeakerPanel({
  speaker,
  content,
  isActive,
  isRecording,
  isSubmitting,
  onActivate,
}: {
  speaker: SpeakerConfig
  content: PanelCopy
  isActive: boolean
  isRecording: boolean
  isSubmitting: boolean
  onActivate: () => void
}) {
  const wrapperClassName = speaker.upsideDown ? "flex h-full flex-col justify-between rotate-180" : "flex h-full flex-col justify-between"
  const textAlignClassName = speaker.align === "right" ? "text-right" : "text-left"
  const justifyClassName = speaker.align === "right" ? "justify-end" : "justify-start"
  const pillTextClassName = speaker.align === "right" ? "justify-start" : "justify-end"

  const isLive = isActive && isRecording

  return (
    <section className={cn("relative flex-1 rounded-[2rem] border px-5 pb-10 pt-6 shadow-[0_24px_60px_rgba(0,0,0,0.32)]", speaker.borderColor, speaker.panelClassName)}>
      <div className={wrapperClassName}>
        <div className={cn("flex items-center justify-between", speaker.align === "right" && "flex-row-reverse")}>
          <button
            type="button"
            onClick={onActivate}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full bg-[#101936] text-[#d8def6] transition-colors",
              isActive && "ring-2 ring-offset-2 ring-offset-transparent",
            )}
            style={isActive ? { boxShadow: `0 0 0 2px ${speaker.accentColor}` } : undefined}
            aria-label={`Use ${speaker.name}`}
          >
            <Keyboard size={18} />
          </button>

          <div className={cn("flex items-center gap-3", speaker.align === "right" && "flex-row-reverse")}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg" style={{ backgroundColor: `${speaker.accentColor}24` }}>
              👤
            </div>
            <div className={textAlignClassName}>
              <p className="text-sm font-semibold text-[#eef1ff]">{speaker.name}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8ea0c9]">{speaker.sourceLanguage}</p>
            </div>
          </div>
        </div>

        <div className={cn("mt-10 rounded-[1.75rem] border p-5", speaker.cardClassName, textAlignClassName)}>
          <p className="text-sm uppercase tracking-[0.2em] text-[#7f91be]">{content.heading}</p>
          <p className="mt-3 min-h-[5.5rem] text-[1.55rem] leading-tight text-[#eef1ff]">{content.body}</p>
          <div className={cn("mt-6 flex items-end gap-2", justifyClassName)}>
            <div
              className={cn(
                "h-14 w-2 origin-bottom rounded-full",
                speaker.wavePrimary,
                isLive ? "animate-[voiceBarA_0.85s_ease-in-out_infinite]" : "scale-y-[0.42]"
              )}
            />
            <div
              className={cn(
                "h-14 w-2 origin-bottom rounded-full",
                speaker.waveSecondary,
                isLive ? "animate-[voiceBarB_1s_ease-in-out_infinite]" : "scale-y-[0.78]"
              )}
            />
            <div
              className={cn(
                "h-14 w-2 origin-bottom rounded-full",
                speaker.wavePrimary,
                isLive ? "animate-[voiceBarC_0.9s_ease-in-out_infinite]" : "scale-y-[0.56]"
              )}
            />
            <div
              className={cn(
                "h-14 w-2 origin-bottom rounded-full",
                speaker.waveSecondary,
                isLive ? "animate-[voiceBarD_1.1s_ease-in-out_infinite]" : "scale-y-100"
              )}
            />
            <div
              className={cn(
                "h-14 w-2 origin-bottom rounded-full",
                speaker.wavePrimary,
                isLive ? "animate-[voiceBarE_0.8s_ease-in-out_infinite]" : "scale-y-[0.64]"
              )}
            />
          </div>
        </div>

        <div className={cn("mt-4 flex", pillTextClassName)}>
          <button
            type="button"
            onClick={() => playAudio(content.audioUrl)}
            disabled={!content.audioUrl}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[#d7def7] disabled:cursor-default disabled:opacity-70"
            style={{
              backgroundColor: speaker.key === "person1" ? "#202d54" : "#173343",
              color: speaker.key === "person1" ? "#d7def7" : "#d6fff0",
            }}
          >
            {isSubmitting && isActive ? (
              <Loader2 size={14} className="animate-spin" />
            ) : content.statusVariant === "saved" ? (
              <Check size={14} />
            ) : content.statusVariant === "audio" ? (
              <Volume2 size={14} style={{ color: speaker.accentColor }} />
            ) : (
              <Mic size={14} style={{ color: speaker.accentColor }} />
            )}
            {content.status}
          </button>
        </div>
      </div>
    </section>
  )
}

export function ConversationPage() {
  const [activeSpeakerKey, setActiveSpeakerKey] = useState<SpeakerKey>("person1")
  const [draftText, setDraftText] = useState("")
  const [turns, setTurns] = useState<ConversationTurn[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState("")
  const [persistenceState, setPersistenceState] = useState<"unknown" | "saved" | "guest">("unknown")

  const activeSpeaker = useMemo(
    () => speakers.find((speaker) => speaker.key === activeSpeakerKey) || speakers[0],
    [activeSpeakerKey]
  )

  const panelCopy = useMemo(
    () =>
      Object.fromEntries(
        speakers.map((speaker) => [speaker.key, getPanelCopy(turns, speaker)])
      ) as Record<SpeakerKey, PanelCopy>,
    [turns]
  )

  const ensureConversation = async () => {
    if (conversationId) {
      return conversationId
    }

    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: buildConversationTitle() }),
    })

    if (response.status === 401) {
      setPersistenceState("guest")
      return undefined
    }

    if (!response.ok) {
      throw new Error("Unable to create a saved conversation right now.")
    }

    const conversation = await response.json()
    setConversationId(conversation.id)
    setPersistenceState("saved")
    return conversation.id as string
  }

  const submitTurn = async ({
    audioBlob,
    transcriptText,
  }: {
    audioBlob?: Blob
    transcriptText?: string
  }) => {
    if (!audioBlob && !transcriptText?.trim()) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const currentConversationId = await ensureConversation().catch((saveError) => {
        console.error(saveError)
        setPersistenceState("guest")
        return undefined
      })

      const formData = new FormData()
      formData.append("sourceLang", activeSpeaker.sourceLanguage)
      formData.append("targetLang", activeSpeaker.targetLanguage)

      if (audioBlob) {
        formData.append("audio", audioBlob, "turn.webm")
      }

      if (transcriptText?.trim()) {
        formData.append("transcriptText", transcriptText.trim())
      }

      if (currentConversationId) {
        formData.append("conversationId", currentConversationId)
      }

      const response = await fetch("/api/process-turn", {
        method: "POST",
        body: formData,
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to process this turn.")
      }

      setTurns((currentTurns) => [
        ...currentTurns,
        {
          id: payload.id || crypto.randomUUID(),
          speakerKey: activeSpeaker.key,
          transcript: payload.transcript,
          translatedText: payload.translatedText,
          audioUrl: payload.audioUrl,
          saved: Boolean(currentConversationId),
        },
      ])
      
      // Auto-play translation
      if (payload.audioUrl) {
        playAudio(payload.audioUrl)
      }

      setDraftText("")
      // Automatic Turn-Taking
      setActiveSpeakerKey(activeSpeaker.key === "person1" ? "person2" : "person1")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
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

          <div className="flex items-center gap-2 rounded-full border border-[#c8aefc]/15 bg-[#12203f]/80 px-3 py-2 text-sm text-[#d8def6]">
            <ArrowRightLeft size={14} className="text-[#c8aefc]" />
            {persistenceState === "saved" ? "Synced" : "Live"}
          </div>
        </div>

        <div className="relative flex min-h-[calc(100dvh-11rem)] flex-col px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8">
          <SpeakerPanel
            speaker={speakers[0]}
            content={panelCopy[speakers[0].key]}
            isActive={activeSpeakerKey === speakers[0].key}
            isRecording={isRecording}
            isSubmitting={isSubmitting}
            onActivate={() => setActiveSpeakerKey(speakers[0].key)}
          />

          <AudioRecorder
            disabled={isSubmitting}
            onError={setError}
            onRecordingStateChange={setIsRecording}
            onRecordingComplete={(audioBlob) => submitTurn({ audioBlob })}
          >
            {({ isSupported, startRecording, stopRecording }) => (
              <div className="pointer-events-none relative z-20 -my-10 flex justify-center sm:-my-14">
                <div className="relative mx-auto flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(181,137,255,0.28)_0%,rgba(181,137,255,0.08)_48%,transparent_72%)]" />
                  <div className="absolute inset-[14px] rounded-full border border-[#f0d5ff]/20 bg-[#120f2d]/90 shadow-[0_16px_40px_rgba(107,63,201,0.38)] sm:inset-[18px]" />
                  <button
                    type="button"
                    onMouseDown={() => { if(!isSubmitting && isSupported) void startRecording(); }}
                    onMouseUp={() => { if(isRecording) stopRecording(); }}
                    onTouchStart={(e) => { e.preventDefault(); if(!isSubmitting && isSupported) void startRecording(); }}
                    onTouchEnd={(e) => { e.preventDefault(); if(isRecording) stopRecording(); }}
                    disabled={isSubmitting || !isSupported}
                    className="pointer-events-auto relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] text-[#2e0b5a] shadow-[0_12px_30px_rgba(164,92,255,0.45)] disabled:opacity-50 sm:h-20 sm:w-20"
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                  >
                    {isSubmitting ? (
                      <Loader2 size={28} className="animate-spin sm:h-9 sm:w-9" strokeWidth={2.6} />
                    ) : (
                      <Mic size={28} className="sm:h-9 sm:w-9" strokeWidth={2.6} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </AudioRecorder>

          <SpeakerPanel
            speaker={speakers[1]}
            content={panelCopy[speakers[1].key]}
            isActive={activeSpeakerKey === speakers[1].key}
            isRecording={isRecording}
            isSubmitting={isSubmitting}
            onActivate={() => setActiveSpeakerKey(speakers[1].key)}
          />

          <div className="mt-5 rounded-[2rem] border border-[#b9c7df]/10 bg-[#0d1734]/85 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-[#8ea0c9] sm:text-xs">
              <span>{activeSpeaker.name}</span>
              <span className="text-right">{activeSpeaker.sourceLanguage} to {activeSpeaker.targetLanguage}</span>
            </div>

            <div className="mt-3 flex gap-3">
              <textarea
                value={draftText}
                onChange={(event) => setDraftText(event.target.value)}
                placeholder={`Type what ${activeSpeaker.name.toLowerCase()} wants to say...`}
                className="min-h-[84px] flex-1 resize-none rounded-[1.4rem] border border-[#d0bcff]/10 bg-[#091127] px-4 py-3 text-sm text-[#eef1ff] outline-none placeholder:text-[#69789e] sm:min-h-[90px]"
              />
              <button
                type="button"
                onClick={() => submitTurn({ transcriptText: draftText })}
                disabled={isSubmitting || !draftText.trim()}
                className="flex h-auto min-h-[84px] w-12 items-center justify-center rounded-[1.4rem] bg-[#1d2b55] text-[#d0bcff] disabled:opacity-40 sm:min-h-[90px] sm:w-14"
                aria-label="Send typed turn"
              >
                <Send size={20} />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-[#9fb0d4]">
                {isRecording ? <Loader2 size={15} className="animate-spin" /> : <Mic size={15} />}
                <span>
                  {isRecording
                    ? "Recording..."
                    : "Use the center mic for speech or type a message here."}
                </span>
              </div>

              {conversationId && (
                <Link href="/history" className="text-[#d0bcff]">
                  View history
                </Link>
              )}
            </div>

            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
