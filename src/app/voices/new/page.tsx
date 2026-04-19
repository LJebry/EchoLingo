"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, ChevronRight, Loader2, Mic, Music, Sparkles, Globe2, AlertCircle } from "lucide-react"
import AudioRecorder from "@/components/AudioRecorder"
import { cn } from "@/lib/utils"

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

const TRAINING_PHRASES_BY_LANGUAGE: Record<string, string[]> = {
  English: [
    "The quick brown fox jumps over the lazy dog.",
    "EchoLingo helps me speak any language naturally and fluently.",
    "I am recording my voice to create a personal digital profile.",
    "Technology should bring people together through better communication.",
    "Artificial intelligence can analyze the unique qualities of my voice.",
    "I look forward to having natural conversations in many different languages.",
    "Every person has a unique vocal identity that carries emotion and intent.",
  ],
  Spanish: [
    "El zorro marrón salta sobre el perro tranquilo.",
    "EchoLingo me ayuda a hablar con naturalidad y confianza.",
    "Estoy grabando mi voz para crear un perfil digital personal.",
    "La tecnología debe acercar a las personas con mejor comunicación.",
    "Mi voz tiene ritmo, emoción y una identidad única.",
    "Quiero tener conversaciones naturales en muchos idiomas.",
    "Cada palabra puede transmitir intención, calma y claridad.",
  ],
  French: [
    "Le renard brun saute par-dessus le chien tranquille.",
    "EchoLingo m'aide à parler naturellement avec confiance.",
    "J'enregistre ma voix pour créer un profil numérique personnel.",
    "La technologie devrait rapprocher les personnes par la communication.",
    "Ma voix porte du rythme, de l'émotion et une identité unique.",
    "Je veux avoir des conversations naturelles dans plusieurs langues.",
    "Chaque phrase peut transmettre une intention calme et claire.",
  ],
  German: [
    "Der braune Fuchs springt über den ruhigen Hund.",
    "EchoLingo hilft mir, natürlich und sicher zu sprechen.",
    "Ich nehme meine Stimme auf, um ein persönliches Profil zu erstellen.",
    "Technologie sollte Menschen durch bessere Kommunikation verbinden.",
    "Meine Stimme hat Rhythmus, Gefühl und eine eigene Identität.",
    "Ich möchte natürliche Gespräche in vielen Sprachen führen.",
    "Jeder Satz kann Absicht, Ruhe und Klarheit vermitteln.",
  ],
  Italian: [
    "La volpe marrone salta sopra il cane tranquillo.",
    "EchoLingo mi aiuta a parlare in modo naturale e sicuro.",
    "Sto registrando la mia voce per creare un profilo personale.",
    "La tecnologia dovrebbe unire le persone con una comunicazione migliore.",
    "La mia voce ha ritmo, emozione e una identità unica.",
    "Voglio avere conversazioni naturali in molte lingue.",
    "Ogni frase può trasmettere intenzione, calma e chiarezza.",
  ],
  Portuguese: [
    "A raposa marrom salta sobre o cachorro tranquilo.",
    "O EchoLingo me ajuda a falar com naturalidade e confiança.",
    "Estou gravando minha voz para criar um perfil digital pessoal.",
    "A tecnologia deve aproximar as pessoas com melhor comunicação.",
    "Minha voz tem ritmo, emoção e uma identidade única.",
    "Quero ter conversas naturais em muitos idiomas.",
    "Cada frase pode transmitir intenção, calma e clareza.",
  ],
  Hindi: [
    "मेरी आवाज़ शांत, स्पष्ट और स्वाभाविक लगती है।",
    "EchoLingo मुझे आत्मविश्वास के साथ बोलने में मदद करता है।",
    "मैं अपनी आवाज़ का एक व्यक्तिगत डिजिटल प्रोफ़ाइल बना रहा हूँ।",
    "तकनीक बेहतर संवाद के ज़रिए लोगों को जोड़ सकती है।",
    "मेरी आवाज़ में लय, भावना और एक अलग पहचान है।",
    "मैं कई भाषाओं में स्वाभाविक बातचीत करना चाहता हूँ।",
    "हर वाक्य शांति, स्पष्टता और इरादे को दिखा सकता है।",
  ],
  Japanese: [
    "私の声は自然で、はっきりしています。",
    "EchoLingoは自信を持って話すために役立ちます。",
    "私は自分の声の個人プロフィールを作っています。",
    "テクノロジーはより良い会話で人々をつなげます。",
    "私の声にはリズム、感情、そして個性があります。",
    "私はいろいろな言語で自然に会話したいです。",
    "一つ一つの言葉には意味と落ち着きがあります。",
  ],
}

const TARGET_SECONDS = 20
const MIN_SECONDS = 5

export default function NewVoicePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [displayName, setDisplayName] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("English")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const trainingPhrases = useMemo(
    () => TRAINING_PHRASES_BY_LANGUAGE[sourceLanguage] || TRAINING_PHRASES_BY_LANGUAGE.English,
    [sourceLanguage]
  )

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  useEffect(() => {
    setCurrentPhraseIndex(0)
    setRecordedBlob(null)
    setRecordingSeconds(0)
    setError("")
  }, [sourceLanguage])

  // Cycle phrases while recording
  useEffect(() => {
    if (isRecording && recordingSeconds > 0 && recordingSeconds % 4 === 0) {
      setCurrentPhraseIndex(prev => (prev + 1) % trainingPhrases.length)
    }
  }, [isRecording, recordingSeconds, trainingPhrases.length])

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
    
    if (recordingSeconds < MIN_SECONDS) {
      setError(`Audio is too short. Please record for at least ${MIN_SECONDS} seconds.`)
      return
    }

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
          Your custom voice profile <b>&quot;{displayName}&quot;</b> is now active. It will be used to speak your translations in <b>any language</b> with your natural tone.
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

  const progress = Math.min((recordingSeconds / TARGET_SECONDS) * 100, 100)

  return (
    <div className="flex min-h-screen flex-col bg-[#020b23] px-4 pb-28 pt-8 text-white">
      <header className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => step > 1 ? setStep(1) : router.back()}
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
                We&apos;ll use this language to analyze your voice during the training guided session.
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
            <p className="text-base text-[#92a2c5]">
              {isRecording 
                ? `Keep reading the ${sourceLanguage} phrases as they change...` 
                : `Read the ${sourceLanguage} phrases naturally. A longer sample (20s) ensures maximum accuracy.`}
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#d0bcff]/20 bg-[linear-gradient(180deg,rgba(27,38,73,0.96),rgba(14,22,46,0.92))] p-10 shadow-2xl min-h-[16rem] flex flex-col justify-center">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sparkles size={120} />
             </div>
             
             <div className="relative z-10 flex flex-col items-center">
               <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-primary">
                  <Music size={28} />
               </div>
               
               <p className="text-center text-xl font-semibold leading-relaxed tracking-tight text-[#eef1ff] min-h-[5rem] flex items-center justify-center animate-fade-in">
                 &quot;{trainingPhrases[currentPhraseIndex] || trainingPhrases[0]}&quot;
               </p>
               
               <div className="mt-8 flex justify-center gap-2 h-8">
                  {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1.5 rounded-full transition-all duration-300",
                        i % 2 === 0 ? "bg-primary" : "bg-accent",
                        isRecording ? "animate-wave-bar" : "scale-y-[0.2] opacity-10"
                      )}
                      style={{ 
                        height: `${[12, 24, 32, 18, 28, 14, 26, 20, 10, 22, 30, 16, 24][i]}px`,
                        animationDelay: `${i * 70}ms` 
                      }}
                    />
                  ))}
               </div>
             </div>
          </div>

          <div className="mt-auto flex flex-col items-center space-y-8">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-end px-1">
                <p className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em]",
                  isRecording ? "text-primary" : "text-[#7e8cb1]"
                )}>
                  {isRecording ? "Recording DNA..." : recordedBlob ? "Sample Ready" : "Target: 20 Seconds"}
                </p>
                <p className="text-[10px] font-black font-mono text-[#7e8cb1]">
                  {recordingSeconds}s / {TARGET_SECONDS}s
                </p>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                 <div 
                   className={cn(
                     "h-full transition-all duration-500",
                     recordingSeconds >= TARGET_SECONDS ? "bg-[#8bd6b4]" : "bg-primary"
                   )} 
                   style={{ width: `${progress}%` }}
                 />
              </div>
            </div>

            <AudioRecorder
              onRecordingStateChange={setIsRecording}
              onRecordingComplete={handleRecordingComplete}
            >
              {({ startRecording, stopRecording }) => (
                <div className="relative h-24 w-24">
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
                      "relative z-10 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 shadow-2xl",
                      isRecording 
                        ? "bg-red-500 scale-110 shadow-red-500/40" 
                        : recordedBlob 
                          ? "bg-[#162242] text-[#8bd6b4] border border-[#8bd6b4]/30" 
                          : "bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] text-[#2e0b5a]"
                    )}
                  >
                    {isRecording ? (
                      <div className="flex items-center justify-center">
                        <span className="absolute h-full w-full rounded-full animate-ping bg-white/20" />
                        <Mic size={32} className="text-white" />
                      </div>
                    ) : recordedBlob ? (
                      <div className="flex flex-col items-center">
                        <Check size={28} strokeWidth={3} />
                        <span className="text-[8px] font-black uppercase mt-0.5">Retake</span>
                      </div>
                    ) : (
                      <Mic size={32} />
                    )}
                  </button>
                </div>
              )}
            </AudioRecorder>

            <div className="w-full space-y-5">
              {error && (
                <div className="flex items-center justify-center gap-2 text-red-400 bg-red-400/10 py-3 rounded-2xl border border-red-400/20">
                  <AlertCircle size={16} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={!recordedBlob || isSubmitting || isRecording}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] py-5 font-bold text-[#2e0b5a] shadow-[0_15px_40px_rgba(164,92,255,0.3)] disabled:opacity-30 disabled:grayscale disabled:shadow-none transition-all hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    <span>Analyzing Vocal DNA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    <span>Create Universal Profile</span>
                  </>
                )}
              </button>
              
              {!recordedBlob && !isRecording && (
                <p className="text-center text-[10px] text-[#7e8cb1] uppercase tracking-widest animate-pulse">
                  Tap mic to start training
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
