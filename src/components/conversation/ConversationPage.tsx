"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRightLeft,
  Check,
  Globe,
  Keyboard,
  Loader2,
  Mic,
  Send,
  Settings2,
  Volume2,
} from "lucide-react"
import AudioRecorder from "@/components/AudioRecorder"
import { cn } from "@/lib/utils"
import { UserProfile } from "@/components/layout/UserProfile"

type SpeakerKey = "person1" | "person2"

type SpeakerVisualConfig = {
  key: SpeakerKey
  name: string
  accentColor: string
  borderColor: string
  panelClassName: string
  cardClassName: string
  wavePrimary: string
  waveSecondary: string
  align: "left" | "right"
  upsideDown?: boolean
}

type SpeakerConfig = SpeakerVisualConfig & {
  sourceLanguage: string
  targetLanguage: string
}

type SpeakerProfile = {
  id: string
  displayName: string
  elevenLabsVoiceId?: string | null
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

const languageOptions = [
  "English (US)",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Hindi",
  "Japanese",
]

const idleWaveScales = [0.42, 0.78, 0.56, 1, 0.64]

const speakerVisuals: SpeakerVisualConfig[] = [
  {
    key: "person2",
    name: "Person 2",
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

const initialSpeakerLanguages: Record<SpeakerKey, string> = {
  person1: "English (US)",
  person2: "Spanish",
}

function buildConversationTitle() {
  return `Conversation ${new Date().toLocaleString()}`
}

function getOtherSpeakerKey(speakerKey: SpeakerKey): SpeakerKey {
  return speakerKey === "person1" ? "person2" : "person1"
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
    heading: "Ready",
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
  isSubmitting,
  isRecording,
  isRecorderSupported,
  liveLevels,
  availableProfiles,
  selectedProfileId,
  onProfileChange,
  onLanguageChange,
  onActivate,
  onMicToggle,
}: {
  speaker: SpeakerConfig
  content: PanelCopy
  isActive: boolean
  isSubmitting: boolean
  isRecording: boolean
  isRecorderSupported: boolean
  liveLevels: number[]
  availableProfiles: SpeakerProfile[]
  selectedProfileId: string
  onProfileChange: (id: string) => void
  onLanguageChange: (language: string) => void
  onActivate: () => void
  onMicToggle: () => void
}) {
  const wrapperClassName = speaker.upsideDown
    ? "flex h-full min-h-0 w-full flex-col rotate-180 lg:rotate-0"
    : "flex h-full min-h-0 w-full flex-col"
  const textAlignClassName = speaker.align === "right" ? "text-right" : "text-left"
  const justifyClassName = speaker.align === "right" ? "justify-end" : "justify-start"
  const controlsRowClassName = speaker.align === "right" ? "justify-end" : "justify-start"
  const rowDirectionClassName = speaker.align === "right" ? "flex-row-reverse" : ""
  const selectedProfileName =
    availableProfiles.find((profile) => profile.id === selectedProfileId)?.displayName || "AI Voice"

  const waveScales = liveLevels.length > 0
    ? liveLevels.map((level) => Math.max(0.12, Math.min(1, level * 1.65 + 0.08)))
    : idleWaveScales

  const statusPill = (
    <div
      className="inline-flex max-w-[8.25rem] items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] text-[#d7def7] shadow-[0_8px_22px_rgba(0,0,0,0.18)] sm:max-w-[8.75rem] sm:gap-2 sm:px-3 sm:py-2 sm:text-xs"
      style={{
        backgroundColor: speaker.key === "person1" ? "#202d54" : "#173343",
        color: speaker.key === "person1" ? "#d7def7" : "#d6fff0",
      }}
    >
      {content.statusVariant === "saved" ? (
        <Check size={13} />
      ) : content.statusVariant === "audio" ? (
        <Volume2 size={13} style={{ color: speaker.accentColor }} />
      ) : (
        <Mic size={13} style={{ color: speaker.accentColor }} />
      )}
      <span className="truncate">{content.status}</span>
    </div>
  )

  const micButton = (
    <button
      type="button"
      onClick={onMicToggle}
      disabled={!isRecorderSupported || isSubmitting}
      className={cn(
        "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#2e0b5a] shadow-[0_12px_30px_rgba(164,92,255,0.45)] transition-transform disabled:opacity-50 sm:h-14 sm:w-14 lg:h-16 lg:w-16",
        isRecording
          ? "bg-[linear-gradient(180deg,#f0d5ff_0%,#be7cff_100%)] scale-105"
          : "bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)]"
      )}
      aria-label={isRecording ? `Stop recording ${speaker.name}` : `Start recording ${speaker.name}`}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(181,137,255,0.28)_0%,rgba(181,137,255,0.08)_48%,transparent_72%)]" />
      <div className="relative z-10">
        {isSubmitting && isActive ? (
          <Loader2 size={18} className="animate-spin sm:h-5 sm:w-5 lg:h-6 lg:w-6" strokeWidth={2.6} />
        ) : (
          <Mic size={18} className="sm:h-5 sm:w-5 lg:h-6 lg:w-6" strokeWidth={2.6} />
        )}
      </div>
    </button>
  )

  const footerItems = speaker.upsideDown
    ? [
        {
          key: "listen",
          alignClassName: "justify-self-start",
          node: (
            <button
              type="button"
              onClick={() => playAudio(content.audioUrl)}
              disabled={!content.audioUrl}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#101936] text-[#d7def7] shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-colors disabled:cursor-default disabled:opacity-50 sm:h-11 sm:w-11"
              aria-label={`Play translated audio for ${speaker.name}`}
            >
              {isSubmitting && isActive ? (
                <Loader2 size={16} className="animate-spin" />
              ) : content.statusVariant === "saved" ? (
                <Check size={16} />
              ) : (
                <Volume2 size={16} style={{ color: speaker.accentColor }} />
              )}
            </button>
          ),
        },
        {
          key: "mic",
          alignClassName: "justify-self-center",
          node: micButton,
        },
        {
          key: "status",
          alignClassName: "justify-self-end",
          node: statusPill,
        },
      ]
    : [
        {
          key: "status",
          alignClassName: "justify-self-start",
          node: statusPill,
        },
        {
          key: "mic",
          alignClassName: "justify-self-center",
          node: micButton,
        },
        {
          key: "listen",
          alignClassName: "justify-self-end",
          node: (
            <button
              type="button"
              onClick={() => playAudio(content.audioUrl)}
              disabled={!content.audioUrl}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#101936] text-[#d7def7] shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-colors disabled:cursor-default disabled:opacity-50 sm:h-11 sm:w-11"
              aria-label={`Play translated audio for ${speaker.name}`}
            >
              {isSubmitting && isActive ? (
                <Loader2 size={16} className="animate-spin" />
              ) : content.statusVariant === "saved" ? (
                <Check size={16} />
              ) : (
                <Volume2 size={16} style={{ color: speaker.accentColor }} />
              )}
            </button>
          ),
        },
      ]

  return (
    <section
      className={cn(
        "relative flex h-full min-h-0 w-full flex-1 overflow-hidden rounded-[2rem] border px-3 pb-3 pt-3 shadow-[0_24px_60px_rgba(0,0,0,0.32)] sm:px-5 sm:pb-4 sm:pt-4 lg:px-6 lg:pt-6",
        speaker.borderColor,
        speaker.panelClassName,
        isActive && "ring-2 ring-primary/20"
      )}
    >
      <div className={wrapperClassName}>
        <div className={cn("flex items-start", rowDirectionClassName)}>
          <button
            type="button"
            onClick={onActivate}
            disabled={isRecording || isSubmitting}
            className={cn(
              "flex min-w-0 items-center gap-3 rounded-[1.2rem] text-inherit transition-colors disabled:opacity-60",
              rowDirectionClassName
            )}
            aria-label={`Type as ${speaker.name}`}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-base sm:h-12 sm:w-12 sm:text-lg"
              style={{ backgroundColor: `${speaker.accentColor}24` }}
            >
              👤
            </div>
            <div className={cn("min-w-0", textAlignClassName)}>
              <p className="text-[0.95rem] font-semibold text-[#eef1ff] sm:text-sm">{speaker.name}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8ea0c9] sm:text-xs">
                {speaker.sourceLanguage} to {speaker.targetLanguage}
              </p>
            </div>
          </button>
        </div>

        <div className={cn("mt-3 flex flex-wrap gap-2", controlsRowClassName)}>
          <div className="relative group">
            <select
              value={speaker.sourceLanguage}
              onChange={(event) => onLanguageChange(event.target.value)}
              disabled={isRecording || isSubmitting}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={`Select ${speaker.name} language`}
            >
              {languageOptions.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
            <div className="flex h-9 items-center gap-1.5 rounded-full border border-white/5 bg-[#101936] pl-3 pr-3.5 text-[11px] font-semibold text-[#8ea0c9] group-hover:bg-[#162242] sm:h-10 sm:gap-2 sm:pr-4 sm:text-xs">
              <ArrowRightLeft size={13} className="text-[#c8aefc] sm:h-[14px] sm:w-[14px]" />
              <span className="max-w-[92px] truncate sm:max-w-[104px]">{speaker.sourceLanguage}</span>
            </div>
          </div>

          <div className="relative group">
            <select
              value={selectedProfileId}
              onChange={(event) => onProfileChange(event.target.value)}
              disabled={isRecording || isSubmitting}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={`Select ${speaker.name} voice profile`}
            >
              <option value="default">Default AI Voice</option>
              {availableProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.displayName}
                </option>
              ))}
            </select>
            <div className="flex h-9 items-center gap-1.5 rounded-full border border-white/5 bg-[#101936] pl-3 pr-3.5 text-[11px] font-semibold text-[#8ea0c9] group-hover:bg-[#162242] sm:h-10 sm:gap-2 sm:pr-4 sm:text-xs">
              <Settings2 size={13} className="text-[#c8aefc] sm:h-[14px] sm:w-[14px]" />
              <span className="max-w-[92px] truncate sm:max-w-[104px]">{selectedProfileName}</span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mt-3 flex min-h-0 flex-1 flex-col rounded-[1.75rem] border p-3 sm:mt-4 sm:p-5",
            speaker.cardClassName,
            textAlignClassName
          )}
        >
          <div className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col">
            <p className="shrink-0 text-[11px] uppercase tracking-[0.2em] text-[#7f91be] sm:text-sm">{content.heading}</p>
            <div className="mt-2.5 min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="min-h-full w-full">
                <p className={cn(
                  "whitespace-pre-wrap break-words leading-tight",
                  content.statusVariant === "waiting"
                    ? "text-base text-[#6f7fa8] leading-relaxed"
                    : "text-[0.95rem] text-[#eef1ff] sm:text-[1.15rem] lg:text-[1.65rem]"
                )}>
                  {content.body}
                </p>
              </div>
            </div>
            <div className={cn("mt-3 flex items-end gap-1.5 shrink-0 sm:mt-4 sm:gap-2", justifyClassName)}>
              {[speaker.wavePrimary, speaker.waveSecondary, speaker.wavePrimary, speaker.waveSecondary, speaker.wavePrimary].map(
                (barColor, index) => (
                  <div
                    key={`${speaker.key}-bar-${index}`}
                    className={cn(
                      "h-8 w-1.5 origin-bottom rounded-full transition-transform duration-100 ease-out sm:h-12 sm:w-2",
                      barColor
                    )}
                    style={{ transform: `scaleY(${waveScales[index] || idleWaveScales[index]})` }}
                  />
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 items-end gap-2 shrink-0 sm:mt-4 sm:gap-3">
          {footerItems.map((item) => (
            <div key={item.key} className={item.alignClassName}>
              {item.node}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ConversationPage() {
  const [activeSpeakerKey, setActiveSpeakerKey] = useState<SpeakerKey>("person1")
  const [recordingSpeakerKey, setRecordingSpeakerKey] = useState<SpeakerKey | null>(null)
  const [draftText, setDraftText] = useState("")
  const [turns, setTurns] = useState<ConversationTurn[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [persistenceState, setPersistenceState] = useState<"unknown" | "saved" | "guest">("unknown")
  const [availableProfiles, setAvailableProfiles] = useState<SpeakerProfile[]>([])
  const [selectedProfiles, setSelectedProfiles] = useState<Record<SpeakerKey, string>>({
    person1: "default",
    person2: "default",
  })
  const [speakerLanguages, setSpeakerLanguages] = useState<Record<SpeakerKey, string>>(
    initialSpeakerLanguages
  )
  const pendingSpeakerKeyRef = useRef<SpeakerKey | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "inherit" // Reset height to recalculate
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${Math.max(48, Math.min(200, scrollHeight))}px`
    }
  }, [draftText])

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await fetch("/api/speaker-profiles")
        if (response.ok) {
          const data = await response.json()
          setAvailableProfiles(data)
        }
      } catch (fetchError) {
        console.error("Failed to fetch speaker profiles", fetchError)
      }
    }

    fetchProfiles()
  }, [])

  const speakers = useMemo(
    () =>
      speakerVisuals.map((speaker) => ({
        ...speaker,
        sourceLanguage: speakerLanguages[speaker.key],
        targetLanguage: speakerLanguages[getOtherSpeakerKey(speaker.key)],
      })),
    [speakerLanguages]
  )

  const activeSpeaker = useMemo(
    () => speakers.find((speaker) => speaker.key === activeSpeakerKey) || speakers[0],
    [activeSpeakerKey, speakers]
  )

  const panelCopy = useMemo(
    () =>
      Object.fromEntries(
        speakers.map((speaker) => [speaker.key, getPanelCopy(turns, speaker)])
      ) as Record<SpeakerKey, PanelCopy>,
    [speakers, turns]
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

  const updateSelectedProfile = (speakerKey: SpeakerKey, profileId: string) => {
    setSelectedProfiles((currentProfiles) => ({
      ...currentProfiles,
      [speakerKey]: profileId,
    }))
  }

  const updateSpeakerLanguage = (speakerKey: SpeakerKey, language: string) => {
    setSpeakerLanguages((currentLanguages) => ({
      ...currentLanguages,
      [speakerKey]: language,
    }))
  }

  const submitTurn = async ({
    speakerKey,
    audioBlob,
    transcriptText,
  }: {
    speakerKey: SpeakerKey
    audioBlob?: Blob
    transcriptText?: string
  }) => {
    if (!audioBlob && !transcriptText?.trim()) {
      return
    }

    const speaker = speakers.find((candidate) => candidate.key === speakerKey)
    if (!speaker) {
      return
    }

    setIsSubmitting(true)
    setError("")
    setNotice("")
    setActiveSpeakerKey(speakerKey)

    try {
      const currentConversationId = await ensureConversation().catch((saveError) => {
        console.error(saveError)
        setPersistenceState("guest")
        return undefined
      })

      const formData = new FormData()
      formData.append("sourceLang", speaker.sourceLanguage)
      formData.append("targetLang", speaker.targetLanguage)

      const selectedProfileId = selectedProfiles[speakerKey]
      const selectedProfile = availableProfiles.find((profile) => profile.id === selectedProfileId)

      if (selectedProfileId !== "default") {
        formData.append("speakerProfileId", selectedProfileId)
      }

      if (selectedProfile?.elevenLabsVoiceId) {
        formData.append("voiceId", selectedProfile.elevenLabsVoiceId)
      }

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
          speakerKey: speaker.key,
          transcript: payload.transcript,
          translatedText: payload.translatedText,
          audioUrl: payload.audioUrl,
          saved: Boolean(currentConversationId),
        },
      ])

      if (payload.audioError) {
        setNotice(payload.audioError)
      }

      if (payload.audioUrl) {
        playAudio(payload.audioUrl)
      }

      setDraftText("")
      setActiveSpeakerKey(getOtherSpeakerKey(speakerKey))
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AudioRecorder
      disabled={isSubmitting}
      onError={(message) => {
        pendingSpeakerKeyRef.current = null
        setRecordingSpeakerKey(null)
        setError(message)
      }}
      onRecordingStateChange={(nextValue) => {
        if (!nextValue) {
          setRecordingSpeakerKey(null)
        }
      }}
      onRecordingComplete={(audioBlob) => {
        const speakerKey = pendingSpeakerKeyRef.current
        pendingSpeakerKeyRef.current = null

        if (!speakerKey) {
          return
        }

        void submitTurn({ audioBlob, speakerKey })
      }}
    >
      {({ audioLevels, isSupported, isRecording: recorderIsRecording, startRecording, stopRecording }) => {
        const handleSpeakerMicToggle = async (speakerKey: SpeakerKey) => {
          if (isSubmitting) {
            return
          }

          if (recorderIsRecording) {
            if (recordingSpeakerKey === speakerKey) {
              stopRecording()
            }
            return
          }

          pendingSpeakerKeyRef.current = speakerKey
          setRecordingSpeakerKey(speakerKey)
          setActiveSpeakerKey(speakerKey)
          setError("")
          setNotice("")
          await startRecording()
        }

        return (
          <main className="flex flex-col min-h-[100svh] bg-[#020b23] text-white">
            <div className="relative flex flex-col flex-1 min-h-0 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.22),transparent_28%),linear-gradient(180deg,#09142f_0%,#050c1f_48%,#09142f_100%)]">
              <div className="flex shrink-0 items-center justify-between px-4 pt-4 md:px-6 lg:px-8 lg:pt-8">
                <div className="flex items-center gap-2 text-[#c8aefc]">
                  <Globe size={18} />
                  <h1 className="text-sm font-semibold tracking-tight">EchoLingo</h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-[#c8aefc]/15 bg-[#12203f]/80 px-3 py-2 text-xs text-[#d8def6]">
                    <ArrowRightLeft size={14} className="text-[#c8aefc]" />
                    {persistenceState === "saved" ? "Synced" : "Live"}
                  </div>
                  <UserProfile />
                </div>
              </div>

              <div className="relative flex flex-col flex-1 min-h-0 px-4 pt-3 md:px-6 lg:px-8 lg:pt-6">
                <div className="flex-1 min-h-0 h-full w-full">
                  <div className="grid h-full min-h-0 gap-4 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-2 lg:grid-rows-1 lg:items-stretch lg:gap-6">
                    <div className="order-1 lg:order-2 lg:col-start-2 flex flex-col min-h-0">
                      <SpeakerPanel
                        speaker={speakers[0]}
                        content={panelCopy[speakers[0].key]}
                        isActive={activeSpeakerKey === speakers[0].key}
                        isSubmitting={isSubmitting}
                        isRecording={recordingSpeakerKey === speakers[0].key}
                        isRecorderSupported={isSupported}
                        liveLevels={recordingSpeakerKey === speakers[0].key ? audioLevels : []}
                        availableProfiles={availableProfiles}
                        selectedProfileId={selectedProfiles[speakers[0].key]}
                        onProfileChange={(id) => updateSelectedProfile(speakers[0].key, id)}
                        onLanguageChange={(language) => updateSpeakerLanguage(speakers[0].key, language)}
                        onActivate={() => setActiveSpeakerKey(speakers[0].key)}
                        onMicToggle={() => {
                          void handleSpeakerMicToggle(speakers[0].key)
                        }}
                      />
                    </div>

                    <div className="order-2 lg:order-1 lg:col-start-1 flex flex-col min-h-0">
                      <SpeakerPanel
                        speaker={speakers[1]}
                        content={panelCopy[speakers[1].key]}
                        isActive={activeSpeakerKey === speakers[1].key}
                        isSubmitting={isSubmitting}
                        isRecording={recordingSpeakerKey === speakers[1].key}
                        isRecorderSupported={isSupported}
                        liveLevels={recordingSpeakerKey === speakers[1].key ? audioLevels : []}
                        availableProfiles={availableProfiles}
                        selectedProfileId={selectedProfiles[speakers[1].key]}
                        onProfileChange={(id) => updateSelectedProfile(speakers[1].key, id)}
                        onLanguageChange={(language) => updateSpeakerLanguage(speakers[1].key, language)}
                        onActivate={() => setActiveSpeakerKey(speakers[1].key)}
                        onMicToggle={() => {
                          void handleSpeakerMicToggle(speakers[1].key)
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 mt-4 mb-[calc(6.75rem+env(safe-area-inset-bottom))] lg:mb-28 w-full rounded-[1.6rem] border border-[#b9c7df]/10 bg-[#0d1734]/88 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.24)] lg:mx-auto lg:mt-6 lg:max-w-4xl lg:p-5">
                  <div className="flex w-full items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em] text-[#8ea0c9] sm:text-xs">
                    <span>{activeSpeaker.name}</span>
                    <span className="text-right">
                      {activeSpeaker.sourceLanguage} to {activeSpeaker.targetLanguage}
                    </span>
                  </div>

                  <div className="mt-3 flex w-full items-center gap-3">
                    <textarea
                      ref={textareaRef}
                      value={draftText}
                      onChange={(event) => setDraftText(event.target.value)}
                      placeholder={`Type what ${activeSpeaker.name.toLowerCase()} wants to say...`}
                      className="h-[48px] flex-1 resize-none overflow-y-auto rounded-[1.25rem] border border-[#d0bcff]/10 bg-[#091127] px-4 py-4 text-sm text-[#eef1ff] outline-none placeholder:text-[#6f7fa8] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        void submitTurn({ transcriptText: draftText, speakerKey: activeSpeakerKey })
                      }}
                      disabled={isSubmitting || !draftText.trim()}
                      className="flex h-[48px] w-12 shrink-0 items-center justify-center self-end rounded-[1.25rem] bg-[#1d2b55] text-[#d0bcff] disabled:opacity-40 sm:h-[54px] sm:w-14"
                      aria-label="Send typed turn"
                    >
                      <Send size={20} />
                    </button>
                  </div>

                  <div className="mt-3 flex w-full items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[#9fb0d4]">
                      {isSubmitting ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Mic size={13} />
                      )}
                      <span className="text-[10px] uppercase tracking-wider opacity-60 truncate">
                        {recorderIsRecording
                          ? "Listening..."
                          : "Type or use speaker mics"}
                      </span>
                    </div>

                    {conversationId && (
                      <Link href="/history" className="text-[10px] font-bold uppercase tracking-widest text-[#d0bcff] hover:underline whitespace-nowrap">
                        History
                      </Link>
                    )}
                  </div>

                  {error && <p className="mt-2 text-center text-[11px] font-medium text-red-300">{error}</p>}
                </div>
              </div>
            </div>
          </main>
        )
      }}
    </AudioRecorder>
  )
}
