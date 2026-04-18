"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, ChevronRight, Loader2, Mic, Music, Sparkles, Globe2 } from "lucide-react"
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

      const formData = new FormData()
      formData.append("audio", recordedBlob, "sample.webm")
      formData.append("displayName", displayName)
      formData.append("sourceLanguage", sourceLanguage)
      formData.append("targetLanguage", "Universal")

      const response = await fetch("/api/speaker-profiles", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save voice profile")
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
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-10 text-center bg-[#020b23]">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#d0bcff]/20 text-[#d0bcff]">
          <Check size={48} strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-bold text-[#eef1ff]">Voice Ready!</h1>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
           <Globe2 size={14} />
           Universal Multilingual Voice
        </div>
        <p className="mt-6 max-w-[20rem] text-[#92a2c5] leading-relaxed">
          Your custom voice profile <b>"{displayName}"</b> is now active. It will be used to speak your translations in <b>any language</b> with your natural tone.
        </p>
        <button
          onClick={() => router.push("/voices")}
          className="mt-10 flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] py-4 font-bold text-[#2e0b5a] shadow-lg hover:opacity-90 transition-opacity"
        >
          View All Voices
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#020b23] px-4 pb-28 pt-8 text-white">
      <header className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#162242] text-[#c8aefc] hover:bg-[#1f2b47] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">Step {step} of 2</h1>
        <div className="w-10" />
      </header>

      {step === 1 ? (
        <div className="flex flex-1 flex-col space-y-8 animate-fade-up">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">Create your universal voice</h2>
            <p className="text-base text-[#92a2c5]">This profile will be used to generate translations in any language using your unique vocal DNA.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#7e8cb1] ml-1">Profile Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. My Personal Voice"
                className="w-full rounded-2xl border border-white/10 bg-[#0d1734] px-6 py-5 text-lg outline-none focus:ring-2 ring-primary/30 transition-all placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#7e8cb1] ml-1">Your Primary Language</label>
              <div className="relative">
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-white/10 bg-[#0d1734] px-6 py-5 text-lg outline-none focus:ring-2 ring-primary/30 transition-all"
                >
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-primary">
                  <ChevronRight className="rotate-90" size={20} />
                </div>
              </div>
              <p className="mt-2 text-xs text-[#7e8cb1] leading-relaxed px-1">
                We'll use this language to analyze your voice during the training guided session.
              </p>
            </div>
          </div>

          <div className="mt-auto">
            {error && <p className="mb-4 text-center text-sm font-medium text-red-400">{error}</p>}
            <button
              onClick={handleFinishStep1}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] py-5 font-bold text-[#2e0b5a] shadow-[0_12px_30px_rgba(164,92,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Recording
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col space-y-8 animate-fade-up">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold leading-tight tracking-tight">Capture your voice</h2>
            <p className="text-base text-[#92a2c5]">Read the phrase below naturally. This sample allows us to clone your voice for all future translations.</p>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#d0bcff]/20 bg-[linear-gradient(180deg,rgba(27,38,73,0.96),rgba(14,22,46,0.92))] p-10 shadow-2xl">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sparkles size={120} />
             </div>
             
             <div className="relative z-10 flex flex-col items-center">
               <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-primary">
                  <Music size={32} />
               </div>
               
               <p className="text-center text-2xl font-semibold leading-relaxed tracking-tight text-[#eef1ff]">
                 "{TRAINING_PHRASES[0]}"
               </p>
               
               <div className="mt-10 flex justify-center gap-2 h-12">
                  {[0,1,2,3,4,5,6,7,8].map(i => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-2 rounded-full transition-all duration-300",
                        i % 3 === 0 ? "bg-primary" : "bg-accent",
                        isRecording ? "animate-wave-bar" : "scale-y-[0.2] opacity-10"
                      )}
                      style={{ 
                        height: `${[16, 32, 48, 24, 40, 20, 36, 28, 12][i]}px`,
                        animationDelay: `${i * 80}ms` 
                      }}
                    />
                  ))}
               </div>
             </div>
          </div>

          <div className="mt-auto flex flex-col items-center space-y-10">
            <AudioRecorder
              onRecordingStateChange={setIsRecording}
              onRecordingComplete={handleRecordingComplete}
            >
              {({ startRecording, stopRecording }) => (
                <div className="relative h-28 w-28">
                  <div className={cn(
                    "absolute inset-0 rounded-full transition-all duration-700",
                    isRecording ? "bg-red-500/20 scale-[1.8] blur-3xl opacity-100" : "bg-primary/20 scale-110 blur-2xl opacity-0"
                  )} />
                  <button
                    onClick={() => {
                      if (isRecording) {
                        stopRecording();
                      } else {
                        void startRecording();
                      }
                    }}
                    className={cn(
                      "relative z-10 flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 shadow-2xl",
                      isRecording 
                        ? "bg-red-500 scale-110" 
                        : recordedBlob 
                          ? "bg-[#8bd6b4] text-white" 
                          : "bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] text-[#2e0b5a]"
                    )}
                  >
                    {isRecording ? (
                      <div className="flex items-center justify-center">
                        <span className="absolute h-full w-full rounded-full animate-ping bg-white/20" />
                        <Mic size={40} className="text-white" />
                      </div>
                    ) : recordedBlob ? (
                      <Check size={40} strokeWidth={3} />
                    ) : (
                      <Mic size={40} />
                    )}
                  </button>
                </div>
              )}
            </AudioRecorder>

            <div className="w-full space-y-5">
              <div className="flex flex-col items-center gap-1.5">
                <p className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-colors",
                  isRecording ? "text-red-400" : recordedBlob ? "text-[#8bd6b4]" : "text-[#7e8cb1]"
                )}>
                  {isRecording ? "Recording DNA..." : recordedBlob ? "Sample Captured" : "Hold to Record"}
                </p>
                <div className="h-1 w-24 rounded-full bg-white/5 overflow-hidden">
                   <div className={cn(
                     "h-full bg-primary transition-all duration-500",
                     recordedBlob ? "w-full" : "w-0"
                   )} />
                </div>
              </div>
              
              {error && <p className="text-center text-sm font-medium text-red-400">{error}</p>}
              
              <button
                onClick={handleSubmit}
                disabled={!recordedBlob || isSubmitting}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] py-5 font-bold text-[#2e0b5a] shadow-[0_15px_40px_rgba(164,92,255,0.3)] disabled:opacity-30 disabled:grayscale disabled:shadow-none transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span>Cloning your voice...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    <span>Create Universal Profile</span>
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
