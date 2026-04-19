"use client"

import { useState } from 'react'
import { Mic, Volume2 } from 'lucide-react'

export function TranslatorCard() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [translation, setTranslation] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleToggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate starting recording
      setTranscript("Listening...")
    } else {
      // Simulate finishing recording and processing
      handleProcess()
    }
  }

  const handleProcess = async () => {
    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setTranscript("Hello, how are you doing today?")
      setTranslation("Hola, ¿cómo estás hoy?")
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <div className="w-full space-y-6">
      <div className="rounded-[2rem] border border-outline-ghost/10 bg-surface-low p-6 shadow-2xl">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-support/70">Source (English)</span>
            <p className="text-lg text-on-surface">
              {transcript || "Tap the mic to start speaking..."}
            </p>
          </div>

          <div className="h-px bg-outline-ghost/10" />

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-pulse/70">Translation (Spanish)</span>
            <div className="flex items-start justify-between gap-4">
              <p className="text-2xl font-bold leading-tight text-pulse">
                {translation || "..."}
              </p>
              {translation && (
                <button className="mt-1 rounded-full bg-pulse/10 p-2 text-pulse">
                  <Volume2 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleToggleRecording}
          disabled={isProcessing}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isRecording 
              ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110" 
              : "bg-pulse text-on-pulse shadow-[0_0_30px_rgba(var(--color-pulse),0.3)]"
          }`}
        >
          {isProcessing ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-on-pulse/20 border-t-on-pulse" />
          ) : (
            <Mic size={32} className="text-on-pulse" />
          )}
        </button>
      </div>
    </div>
  )
}
