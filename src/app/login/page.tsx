import Link from "next/link"
import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { ChevronLeft, Globe, Lock, Mail } from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { auth, isGoogleAuthConfigured } from "@/lib/auth"

interface LoginPageProps {
  searchParams?: {
    redirectTo?: string | string[]
  }
}

function getSafeRedirectTo(redirectTo?: string | string[]) {
  const resolvedRedirect = Array.isArray(redirectTo) ? redirectTo[0] : redirectTo

  if (!resolvedRedirect || !resolvedRedirect.startsWith("/") || resolvedRedirect.startsWith("//")) {
    return "/dashboard"
  }

  return resolvedRedirect
}

function FauxInput({
  icon,
  label,
}: {
  icon: ReactNode
  label: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-[#121c38] px-4 py-3.5 text-sm text-[#7483a8]">
      <span className="text-[#8696bd]">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = getSafeRedirectTo(searchParams?.redirectTo)
  const session = await auth()

  if (session?.user?.id) {
    redirect(redirectTo)
  }

  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.18),transparent_28%),linear-gradient(180deg,#09142f_0%,#050c1f_48%,#09142f_100%)] text-white">
      <div className="flex min-h-dvh flex-col px-4 pb-8 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#c8aefc]">
            <Globe size={18} />
            <span className="text-sm font-semibold tracking-tight">EchoLingo</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#162242] px-3.5 py-2 text-sm text-[#eef1ff]"
          >
            <ChevronLeft className="h-4 w-4" />
            Guest
          </Link>
        </div>

        <div className="flex flex-1 items-center">
          <section className="w-full rounded-[2rem] border border-white/8 bg-[#0f1832] px-6 pb-7 pt-8 shadow-[0_25px_50px_rgba(0,0,0,0.3)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#201c47] text-[#c7afff]">
              <Globe className="h-6 w-6" />
            </div>

            <div className="mt-6 space-y-2 text-center">
              <h1 className="text-[2rem] font-semibold tracking-tight text-[#eef1ff]">
                Welcome back
              </h1>
              <p className="mx-auto max-w-[16rem] text-sm leading-relaxed text-[#8b9aba]">
                Log in to sync your voice profiles and translation history seamlessly.
              </p>
            </div>

            <div className="mt-7 space-y-3">
              <FauxInput icon={<Mail className="h-4 w-4" />} label="Email address" />
              <FauxInput icon={<Lock className="h-4 w-4" />} label="Password" />
            </div>

            <div className="mt-6">
              {isGoogleAuthConfigured ? (
                <GoogleSignInButton className="w-full" redirectTo={redirectTo} />
              ) : (
                <div className="rounded-[1.6rem] border border-amber-300/20 bg-amber-300/10 p-5 text-left">
                  <p className="font-semibold text-amber-100">Google sign-in is not configured yet.</p>
                  <p className="mt-2 text-sm leading-relaxed text-amber-100/70">
                    Add `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` to your local env before
                    trying the login flow.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-[#6f7da1]">
              Or connect with Google
            </p>

            <div className="mt-6 flex items-center justify-between text-xs text-[#8b9aba]">
              <Link href="/" className="hover:text-[#d6caff]">
                Forgot password?
              </Link>
              <span>Google sign-in only</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
