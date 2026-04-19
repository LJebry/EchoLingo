import Link from "next/link"
import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { ChevronLeft, Globe, Lock, Mail } from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { BrandLogo } from "@/components/layout/BrandLogo"
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
    <div className="flex items-center gap-3 rounded-full bg-surface-high px-4 py-3.5 text-sm text-support">
      <span className="text-support">{icon}</span>
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
    <main className="min-h-dvh bg-transparent text-on-surface">
      <div className="flex min-h-dvh flex-col px-4 pb-8 pt-5">
        <div className="flex items-center justify-between">
          <BrandLogo />

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-outline-ghost/10 bg-surface-high px-3.5 py-2 text-sm text-on-surface transition-colors hover:bg-surface-highest"
          >
            <ChevronLeft className="h-4 w-4" />
            Guest
          </Link>
        </div>

        <div className="flex flex-1 items-center">
          <section className="w-full rounded-[2rem] border border-outline-ghost/10 bg-surface-low px-6 pb-7 pt-8 shadow-[0_25px_50px_rgba(0,0,0,0.16)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pulse/15 text-pulse">
              <Globe className="h-6 w-6" />
            </div>

            <div className="mt-6 space-y-2 text-center">
              <h1 className="text-[2rem] font-semibold tracking-tight text-on-surface">
                Welcome back
              </h1>
              <p className="mx-auto max-w-[16rem] text-sm leading-relaxed text-support">
                Log in to sync your voice profiles and translation history seamlessly.
              </p>
            </div>

            <div className="mt-7 space-y-6">
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

            <div className="mt-8 flex items-center justify-center text-xs text-support">
              <span className="flex items-center gap-1.5 rounded-full border border-outline-ghost/10 bg-surface-high px-3 py-1.5">
                <Lock size={12} className="text-pulse" />
                Secure Google Authentication Only
              </span>
            </div>

          </section>
        </div>
      </div>
    </main>
  )
}
