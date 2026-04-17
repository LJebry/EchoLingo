"use client"

import { useState } from 'react'
import { Mic, Send, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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
      <div className="p-6 rounded-[2rem] bg-[#131b2e] border border-[#b9c7df]/5 shadow-2xl">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b9c7df]/40">Source (English)</span>
            <p className="text-lg text-[#dae2fd]">
              {transcript || "Tap the mic to start speaking..."}
            </p>
          </div>

          <div className="h-px bg-[#b9c7df]/5" />

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d0bcff]/60">Translation (Spanish)</span>
            <div className="flex items-start justify-between gap-4">
              <p className="text-2xl font-bold text-[#d0bcff] leading-tight">
                {translation || "..."}
              </p>
              {translation && (
                <button className="mt-1 text-[#d0bcff] p-2 bg-[#d0bcff]/10 rounded-full">
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
              : "bg-gradient-to-br from-[#d0bcff] to-[#3c0091] shadow-[0_0_30px_rgba(208,188,255,0.3)]"
          }`}
        >
          {isProcessing ? (
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Mic size={32} className="text-white" />
          )}
        </button>
      </div>
    </div>
  )
}
