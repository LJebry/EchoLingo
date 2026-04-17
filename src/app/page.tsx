const waveformBars = [
  "h-8",
  "h-14",
  "h-10",
  "h-16",
  "h-9",
  "h-12",
  "h-7",
  "h-14",
  "h-10",
];

const liveTurns = [
  {
    speaker: "You • English",
    text: "Can we move our check-in to six?",
    tone: "bg-surface-highest",
    shape: "rounded-t-3xl rounded-r-3xl rounded-bl-md",
  },
  {
    speaker: "Mika • Japanese",
    text: "6時にチェックインへ変更してもいいですか？",
    tone: "bg-surface-high",
    shape: "rounded-t-3xl rounded-l-3xl rounded-br-md",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-8 md:pt-10">
      <header className="animate-fade-up rounded-3xl bg-surface-low/90 p-3 shadow-ambient backdrop-blur-sm sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-lg tracking-wide text-support">EchoLingo</p>
            <p className="text-sm text-on-surface/70">The Digital Polyglot</p>
          </div>

          <div className="flex h-12 min-w-[172px] items-center rounded-[999px_999px_999px_20px] bg-surface-high p-1">
            <button className="h-10 min-w-0 flex-1 rounded-[999px] bg-pulse px-4 text-sm font-semibold text-on-pulse transition hover:shadow-glow">
              EN
            </button>
            <button className="h-10 min-w-0 flex-1 rounded-[999px_20px_999px_999px] px-4 text-sm font-medium text-support transition hover:bg-surface-bright/80">
              JA
            </button>
          </div>
        </div>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-fade-up rounded-3xl bg-surface-low p-6 shadow-ambient [animation-delay:120ms] sm:p-8">
          <p className="text-sm uppercase tracking-[0.18em] text-accent">Live Translation</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-on-surface sm:text-5xl md:text-6xl">
            Speak naturally.
            <br />
            <span className="text-pulse">Translate fluidly.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-on-surface/75 sm:text-lg">
            A seamless voice-first bridge for multilingual conversations with atmospheric clarity.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="min-h-12 rounded-full bg-gradient-to-br from-pulse to-pulse-container px-7 py-3 text-base font-semibold text-on-pulse transition hover:shadow-glow">
              Start Live Session
            </button>
            <button className="min-h-12 rounded-full border border-outline-ghost px-7 py-3 text-base font-medium text-support transition hover:bg-surface-bright/70">
              Preview Voices
            </button>
          </div>

          <div className="mt-8 rounded-2xl bg-surface-high p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-on-surface/75">Waveform Visualizer</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="mt-5 flex h-20 items-end gap-2">
              {waveformBars.map((size, index) => (
                <span
                  key={`${size}-${index}`}
                  className={`w-2 origin-bottom rounded-full ${size} ${
                    index % 3 === 0 ? "bg-pulse" : "bg-accent"
                  } animate-wave-bar`}
                  style={{ animationDelay: `${index * 80}ms` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="animate-fade-up rounded-3xl bg-surface-high p-5 shadow-ambient [animation-delay:220ms] sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="font-display text-2xl text-on-surface">Conversation Stream</p>
            <p className="rounded-full bg-surface-bright px-3 py-1 text-xs text-support">New Engine</p>
          </div>

          <div className="space-y-4">
            {liveTurns.map((turn, idx) => (
              <article
                key={turn.speaker}
                className={`min-h-[136px] p-5 ${turn.tone} ${turn.shape} ${
                  idx === 1 ? "ml-8" : "mr-8"
                }`}
              >
                <p className="text-sm text-support">{turn.speaker}</p>
                <p className="mt-6 font-display text-2xl leading-snug text-on-surface">{turn.text}</p>
              </article>
            ))}
          </div>

          <label className="mt-6 block rounded-2xl bg-surface-bright/95 px-4 pb-3 pt-3">
            <span className="text-xs uppercase tracking-[0.14em] text-support">Whisper Input</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="text"
                placeholder="Type or hold mic to capture speech"
                className="h-12 w-full rounded-xl bg-surface-high px-4 text-sm text-on-surface placeholder:text-on-surface/55 outline-none"
              />
              <button className="flex h-12 min-w-12 items-center justify-center rounded-full bg-pulse text-on-pulse transition hover:shadow-glow">
                Go
              </button>
            </div>
            <span className="mt-3 block h-0.5 w-full rounded-full bg-pulse/85" />
          </label>
        </div>
      </section>
    </main>
  );
}
