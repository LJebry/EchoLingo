import { auth } from "@/lib/auth"
import { getUserSpeakerProfiles } from "@/lib/services/speaker-profiles"
import Link from "next/link"
import {
  Settings,
  Mic2,
  Plus,
  Play,
} from "lucide-react"

type SpeakerProfileItem = {
  id: string
  displayName: string
  sourceLanguage: string
  targetLanguage: string
}

const previewProfiles: SpeakerProfileItem[] = [
  {
    id: "preview-my-voice",
    displayName: "My Voice",
    sourceLanguage: "English",
    targetLanguage: "Spanish",
  },
  {
    id: "preview-abuela",
    displayName: "Abuela",
    sourceLanguage: "Spanish",
    targetLanguage: "English",
  },
  {
    id: "preview-professional",
    displayName: "Professional",
    sourceLanguage: "English",
    targetLanguage: "German",
  },
]

const profileEmojis = ["🧑‍🚀", "👵", "👔", "🧑🏻‍💻", "🎙️"]

const recentTranslations = [
  {
    id: "recent-subway",
    icon: "文A",
    original: '"Where is the nearest subway station?"',
    translated: '"¿Dónde está la estación de metro más cercana?"',
    lang: "EN → ES",
  },
  {
    id: "recent-ramen",
    icon: "💬",
    original: '"I would like to order the spicy ramen, please."',
    translated: '"辛いラーメンをお願いします。"',
    lang: "EN → JA",
  },
  {
    id: "recent-bill",
    icon: "文A",
    original: '"Could we have the bill?"',
    translated: `"L'addition, s'il vous plaît ?"`,
    lang: "EN → FR",
  },
]

function getProfileSubtitle(profile: SpeakerProfileItem) {
  return `${profile.sourceLanguage} → ${profile.targetLanguage}`
}

export default async function VoicesPage() {
  const session = await auth()
  const profiles = session?.user?.id ? await getUserSpeakerProfiles(session.user.id) : previewProfiles

  return (
    <main className="min-h-[calc(100dvh-5rem)] bg-[#010c35] text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-md flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#d9d9e3] bg-[#21385f] text-[28px]">
              👩🏻‍💼
            </div>

            <h1 className="text-[28px] font-semibold tracking-tight text-[#9c6cff]">
              EchoLingo
            </h1>
          </div>

          <Link
            href="/settings"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#071945]"
            aria-label="Open settings"
          >
            <Settings className="h-7 w-7 text-[#9c6cff]" strokeWidth={2.4} />
          </Link>
        </header>

        <section className="mt-10 rounded-[38px] bg-[linear-gradient(135deg,#202857_0%,#313562_55%,#0d1c4c_100%)] px-8 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#232b58]">
              <Mic2 className="h-7 w-7 text-[#a88cff]" strokeWidth={2.2} />
            </div>
            <span className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#b29bff]">
              Neural Synthesis
            </span>
          </div>

          <h2 className="mt-8 text-[32px] font-semibold leading-tight text-[#dbe1f7]">
            Train a New Voice
          </h2>

          <p className="mt-4 max-w-[320px] text-[16px] leading-8 text-[#aeb4cf]">
            Clone your voice or create a custom persona for translations in under 60
            seconds with our advanced LLM models.
          </p>

          <Link
            href="/voices/new"
            className="mt-10 inline-flex h-20 items-center gap-4 rounded-full bg-[#a77cff] px-12 text-[18px] font-semibold text-[#31007f] shadow-[0_12px_36px_rgba(167,124,255,0.35)]"
          >
            <Plus className="h-7 w-7" strokeWidth={2.7} />
            <span>Start Training</span>
          </Link>
        </section>

        <section className="mt-14">
          <div className="flex items-center justify-between">
            <h3 className="text-[24px] font-semibold text-[#dce1f3]">Saved Profiles</h3>
            {!session?.user?.id ? (
              <span className="text-[13px] font-medium text-[#9ea6c6]">Preview Mode</span>
            ) : null}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5">
            {profiles.map((profile, index) => (
              <Link
                key={profile.id}
                href={`/voices/${profile.id}`}
                className="relative rounded-[30px] bg-[#0a1744] px-6 py-7 transition-transform hover:-translate-y-0.5"
              >
                {index === 0 && (
                  <span className="absolute right-5 top-4 h-10 w-10 rounded-full bg-[#caaaff] shadow-[0_0_12px_3px_rgba(202,170,255,0.7)]" />
                )}

                <div className="flex flex-col items-center text-center">
                  <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#111f50] text-[42px]">
                    <span>{profileEmojis[index % profileEmojis.length]}</span>
                  </div>

                  <h4 className="mt-7 text-[22px] font-medium text-[#dde3f5]">
                    {profile.displayName}
                  </h4>

                  <p className={`mt-1 text-[15px] ${index === 0 ? "text-[#b796ff]" : "text-[#9ea6c6]"}`}>
                    {index === 0 ? "Primary Active" : getProfileSubtitle(profile)}
                  </p>
                </div>
              </Link>
            ))}

            <Link
              href="/voices/new"
              className="rounded-[30px] border border-dashed border-[#25345e] bg-[#0a1744] px-6 py-7 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#111f50] text-[42px]">
                  <Plus className="h-10 w-10 text-[#95a0c3]" strokeWidth={2.2} />
                </div>

                <h4 className="mt-7 text-[22px] font-medium text-[#dde3f5]">
                  Import
                </h4>

                <p className="mt-1 text-[15px] text-[#9ea6c6]">
                  Audio File
                </p>
              </div>
            </Link>
          </div>
        </section>

        <section className="mt-14 pb-24">
          <div className="flex items-center justify-between">
            <h3 className="text-[24px] font-semibold text-[#dce1f3]">
              Recent Translations
            </h3>
            <Link href="/history" className="text-[16px] font-medium text-[#b18cff]">
              View All
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            {recentTranslations.map((item) => (
              <article key={item.id} className="rounded-[30px] bg-black px-6 py-7">
                <div className="flex gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#162965] text-[21px] text-[#b997ff]">
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[18px] leading-9 text-[#f1f4ff]">
                      {item.original}
                    </p>
                    <p className="mt-1 text-[18px] leading-8 text-[#c084ff]">
                      {item.translated}
                    </p>

                    <div className="mt-6 flex items-center gap-5">
                      <span className="inline-flex h-10 items-center bg-[#16234c] px-3 text-[14px] text-[#b9c2df]">
                        {item.lang}
                      </span>

                      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9def0]">
                        <Play
                          className="ml-0.5 h-4 w-4 fill-[#1a2345] text-[#1a2345]"
                          strokeWidth={2.2}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
