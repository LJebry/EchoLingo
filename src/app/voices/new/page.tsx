"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, ChevronRight, Loader2, Mic, Music, Sparkles } from "lucide-react"
import AudioRecorder from "@/components/AudioRecorder"
import { cn } from "@/components/ui/Button"

const TRAINING_PHRASES = [
  "The quick brown fox jumps over the lazy dog.",
  "EchoLingo helps me speak any language naturally and fluently.",
  "I am recording my voice to create a personal digital profile.",
  "Technology should bring people together through better communication."
]

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

export default function NewVoicePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [displayName, setDisplayName] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("English")
  const [targetLanguage, setTargetLanguage] = useState("Spanish")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleFinishStep1 = () => {
    if (displayName.trim()) {
      setStep(2)
    } else {
      setError("Please give your voice a name.")
    }
  }

  const handleRecordingComplete = (blob: Blob) => {
    setRecordedBlob(blob)
  }

  const handleSubmit = async () => {
    if (!recordedBlob || !displayName) return

    try {
      setIsSubmitting(true)
      setError("")

      // 1. In a real scenario, we would upload the blob to ElevenLabs 
      // for Instant Voice Cloning and get a voice_id back.
      // For this prototype, we'll mock the success and save the profile.
      
      const response = await fetch("/api/speaker-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          sourceLanguage,
          targetLanguage,
          // elevenLabsVoiceId: "mock-voice-id"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save voice profile")
      }

      setStep(3) // Success step
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 3) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-10 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#d0bcff]/20 text-[#d0bcff]">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-bold text-[#eef1ff]">Voice Trained!</h1>
        <p className="mt-4 max-w-[18rem] text-[#92a2c5]">
          Your custom voice profile "{displayName}" is ready to use in your translations.
        </p>
        <button
          onClick={() => router.push("/voices")}
          className="mt-10 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] py-4 font-bold text-[#2e0b5a]"
        >
          View All Voices
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col px-4 pb-28 pt-8 text-white">
      <header className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#162242] text-[#c8aefc]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Step {step} of 2</h1>
        <div className="w-10" />
      </header>

      {step === 1 ? (
        <div className="flex flex-1 flex-col space-y-8 animate-fade-in">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-tight">Name your voice profile</h2>
            <p className="text-sm text-[#92a2c5]">This helps you identify it later.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7e8cb1]">Profile Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. My English Voice"
                className="w-full rounded-2xl border border-white/10 bg-[#0d1734] px-5 py-4 text-lg outline-none focus:ring-2 ring-primary/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7e8cb1]">Native Lang</label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0d1734] px-4 py-4 text-sm outline-none"
                >
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7e8cb1]">Target Lang</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#0d1734] px-4 py-4 text-sm outline-none"
                >
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}
            <button
              onClick={handleFinishStep1}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] py-4 font-bold text-[#2e0b5a]"
            >
              Continue to Training
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-8 animate-fade-in">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-tight">Guided sample</h2>
            <p className="text-sm text-[#92a2c5]">Read the text below while holding the mic button.</p>
          </div>

          <div className="relative rounded-[2.5rem] border border-[#d0bcff]/20 bg-[linear-gradient(180deg,rgba(27,38,73,0.96),rgba(14,22,46,0.92))] p-8 shadow-xl">
             <div className="mb-6 flex justify-center">
                <Sparkles className="text-[#d0bcff] opacity-40" size={32} />
             </div>
             <p className="text-center text-2xl font-medium italic leading-relaxed text-[#eef1ff]">
               "{TRAINING_PHRASES[0]}"
             </p>
             
             <div className="mt-8 flex justify-center gap-1.5 h-10">
                {[0,1,2,3,4,5,6].map(i => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-1.5 rounded-full transition-all",
                      i % 2 === 0 ? "bg-[#d0bcff]" : "bg-[#8bd6b4]",
                      isRecording ? "animate-wave-bar" : "scale-y-50 opacity-20"
                    )}
                    style={{ 
                      height: `${[16, 28, 40, 32, 38, 20, 12][i]}px`,
                      animationDelay: `${i * 100}ms` 
                    }}
                  />
                ))}
             </div>
          </div>

          <div className="mt-auto flex flex-col items-center space-y-10">
            <AudioRecorder
              onRecordingStateChange={setIsRecording}
              onRecordingComplete={handleRecordingComplete}
            >
              {({ startRecording, stopRecording }) => (
                <div className="relative h-24 w-24">
                  <div className={cn(
                    "absolute inset-0 rounded-full transition-all duration-500",
                    isRecording ? "bg-red-500/30 scale-150 blur-2xl" : "bg-primary/20 scale-110 blur-xl"
                  )} />
                  <button
                    onMouseDown={() => startRecording()}
                    onMouseUp={() => stopRecording()}
                    onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
                    onTouchEnd={() => stopRecording()}
                    className={cn(
                      "relative z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 shadow-2xl",
                      isRecording ? "bg-red-500 scale-110" : recordedBlob ? "bg-[#8bd6b4]" : "bg-gradient-to-br from-primary to-primary-container"
                    )}
                  >
                    {isRecording ? <Mic size={36} className="text-white" /> : recordedBlob ? <Check size={36} className="text-white" /> : <Mic size={36} className="text-[#2e0b5a]" />}
                  </button>
                </div>
              )}
            </AudioRecorder>

            <div className="w-full space-y-4">
              {recordedBlob && !isRecording && (
                <p className="text-center text-sm font-medium text-[#8bd6b4]">Great! We've captured your sample.</p>
              )}
              {error && <p className="text-center text-sm text-red-400">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={!recordedBlob || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] py-4 font-bold text-[#2e0b5a] shadow-lg disabled:opacity-30 disabled:grayscale"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating Profile...
                  </>
                ) : (
                  <>
                    < Sparkles size={20} />
                    Complete Training
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
