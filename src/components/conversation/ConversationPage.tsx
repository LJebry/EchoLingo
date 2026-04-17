"use client"

import {
  Globe,
  Keyboard,
  Mic,
  Languages,
  Clock3,
  AudioLines,
} from "lucide-react"

export function ConversationPage() {
  return (
    <main className="flex min-h-screen justify-center bg-[#020b23] text-white">
      <div className="relative min-h-screen w-full max-w-sm overflow-hidden bg-gradient-to-b from-[#07122f] to-[#010816]">
        <div className="flex items-center justify-between px-6 pt-10">
          <div className="flex items-center gap-2 text-[#c8aefc]">
            <Globe size={26} />
            <h1 className="text-xl font-semibold">EchoLingo</h1>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#12203f]">
            👤
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-10 flex h-40 w-40 items-center justify-center rounded-full bg-[#1c2445]">
            <Mic size={50} className="text-[#c8aefc]" />
          </div>

          <h2 className="text-2xl text-gray-200">Hello, how are you today?</h2>

          <p className="mt-2 text-lg text-green-300">I love this place.</p>

          <div className="mt-6 flex items-end gap-2">
            <div className="h-6 w-2 rounded bg-green-300" />
            <div className="h-10 w-2 rounded bg-purple-300" />
            <div className="h-14 w-2 rounded bg-green-300" />
            <div className="h-8 w-2 rounded bg-purple-300" />
            <div className="h-12 w-2 rounded bg-green-300" />
          </div>

          <div className="mt-10 flex w-full justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0b1635]">
              <Keyboard />
            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#263253] px-4 py-3">
              👤 <span>English (US)</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-28 left-1/2 -translate-x-1/2">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-400">
            <Mic size={40} className="text-purple-900" />
          </div>
        </div>

        <div className="absolute bottom-0 flex w-full justify-around bg-[#07112b] px-4 py-6 text-sm">
          <div className="flex flex-col items-center">
            <Languages />
            <span>Translate</span>
          </div>

          <div className="flex flex-col items-center text-purple-300">
            <Mic />
            <span>Convo</span>
          </div>

          <div className="flex flex-col items-center">
            <AudioLines />
            <span>Voices</span>
          </div>

          <div className="flex flex-col items-center">
            <Clock3 />
            <span>History</span>
          </div>
        </div>
      </div>
    </main>
  )
}
