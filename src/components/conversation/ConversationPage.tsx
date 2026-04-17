"use client"

import {
  Globe,
  Keyboard,
  Mic,
  Languages,
  Clock3,
  AudioLines,
  ArrowRightLeft,
  Volume2,
} from "lucide-react"

export function ConversationPage() {
  return (
    <main className="flex min-h-screen justify-center bg-[#020b23] text-white">
      <div className="relative min-h-screen w-full max-w-sm overflow-hidden bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.22),transparent_28%),linear-gradient(180deg,#09142f_0%,#050c1f_48%,#09142f_100%)]">
        <div className="flex items-center justify-between px-6 pt-10">
          <div className="flex items-center gap-2 text-[#c8aefc]">
            <Globe size={26} />
            <h1 className="text-xl font-semibold">EchoLingo</h1>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#c8aefc]/15 bg-[#12203f]/80 px-3 py-2 text-sm text-[#d8def6]">
            <ArrowRightLeft size={14} className="text-[#c8aefc]" />
            Live
          </div>
        </div>

        <div className="relative flex min-h-screen flex-col px-5 pb-36 pt-8">
          <section className="relative flex-1 rounded-[2rem] border border-[#d0bcff]/10 bg-[linear-gradient(180deg,rgba(27,38,73,0.96),rgba(14,22,46,0.92))] px-5 pb-10 pt-6 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
            <div className="flex h-full flex-col justify-between rotate-180">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d0bcff]/14 text-lg">
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#eef1ff]">Person 1</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8ea0c9]">English (US)</p>
                  </div>
                </div>
                <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101936] text-[#d8def6]">
                  <Keyboard size={18} />
                </button>
              </div>

              <div className="mt-10 rounded-[1.75rem] border border-[#d0bcff]/10 bg-[#0e1731]/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-[#7f91be]">Original</p>
                <p className="mt-3 text-[1.7rem] leading-tight text-[#eef1ff]">Hello, how are you today?</p>
                <div className="mt-6 flex items-end gap-2">
                  <div className="h-6 w-2 rounded-full bg-[#79b3ff]" />
                  <div className="h-11 w-2 rounded-full bg-[#d0bcff]" />
                  <div className="h-8 w-2 rounded-full bg-[#79b3ff]" />
                  <div className="h-14 w-2 rounded-full bg-[#d0bcff]" />
                  <div className="h-9 w-2 rounded-full bg-[#79b3ff]" />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#202d54] px-4 py-2 text-sm text-[#d7def7]">
                  <Volume2 size={14} className="text-[#c8aefc]" />
                  Ready to speak
                </div>
              </div>
            </div>
          </section>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-5">
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(181,137,255,0.28)_0%,rgba(181,137,255,0.08)_48%,transparent_72%)]" />
              <div className="absolute inset-[18px] rounded-full border border-[#f0d5ff]/20 bg-[#120f2d]/90 shadow-[0_16px_40px_rgba(107,63,201,0.38)]" />
              <button className="pointer-events-auto relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d8b6ff_0%,#a45cff_100%)] text-[#2e0b5a] shadow-[0_12px_30px_rgba(164,92,255,0.45)]">
                <Mic size={36} strokeWidth={2.6} />
              </button>
            </div>
          </div>

          <section className="relative mt-8 flex-1 rounded-[2rem] border border-[#8ce2c3]/10 bg-[linear-gradient(180deg,rgba(13,24,45,0.92),rgba(20,40,53,0.96))] px-5 pb-10 pt-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101936] text-[#d8def6]">
                <Keyboard size={18} />
              </button>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-sm font-semibold text-[#eef1ff]">Person 2</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#89cdb4]">Spanish</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8bd6b4]/14 text-lg">
                  👤
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-[#8bd6b4]/10 bg-[#0d1c2c]/80 p-5 text-right">
              <p className="text-sm uppercase tracking-[0.2em] text-[#73b89f]">Translation</p>
              <p className="mt-3 text-[1.7rem] leading-tight text-[#b9f0d8]">Hola, ¿cómo estás hoy?</p>
              <div className="mt-6 flex items-end justify-end gap-2">
                <div className="h-9 w-2 rounded-full bg-[#8bd6b4]" />
                <div className="h-14 w-2 rounded-full bg-[#d0bcff]" />
                <div className="h-8 w-2 rounded-full bg-[#8bd6b4]" />
                <div className="h-11 w-2 rounded-full bg-[#d0bcff]" />
                <div className="h-6 w-2 rounded-full bg-[#8bd6b4]" />
              </div>
            </div>

            <div className="mt-4 flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#173343] px-4 py-2 text-sm text-[#d6fff0]">
                <Volume2 size={14} className="text-[#8bd6b4]" />
                Listening for reply
              </div>
            </div>
          </section>
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
