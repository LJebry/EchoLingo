import Link from "next/link"
import { redirect } from "next/navigation"
import { Globe, ChevronLeft } from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { auth, isGoogleAuthConfigured } from "@/lib/auth"

export default async function LoginPage() {
  const session = await auth()

  if (session?.user?.id) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen bg-[#000f3d] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-10 pt-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full">
              <Globe className="h-9 w-9 text-[#c7afff]" strokeWidth={2.2} />
            </div>
            <h1 className="text-[28px] font-semibold tracking-tight text-[#c7afff]">EchoLingo</h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#44607b] bg-[#214461] px-4 py-3 text-sm font-medium text-[#e6e8f5] transition-colors hover:bg-[#2a4e6f]"
          >
            <ChevronLeft className="h-4 w-4" />
            Guest
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center">
          <section className="mt-12 rounded-[34px] bg-[#0f1c49] px-8 pb-10 pt-10 shadow-[0_18px_35px_rgba(0,0,0,0.22)]">
            <div className="space-y-3 text-left">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#7e8cb1]">Welcome back</p>
              <h2 className="text-[38px] font-semibold leading-tight text-[#dae2fd]">
                Save your conversations and voices.
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-[#9ea8c7]">
                Sign in with Google to sync your history, speaker profiles, and future saved sessions.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {isGoogleAuthConfigured ? (
                <GoogleSignInButton className="w-full" />
              ) : (
                <div className="w-full rounded-[28px] border border-amber-300/20 bg-amber-300/10 p-5 text-left">
                  <p className="font-semibold text-amber-100">Google sign-in is not configured yet.</p>
                  <p className="mt-2 text-sm leading-relaxed text-amber-100/70">
                    Add `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` to your local env before
                    trying the login flow.
                  </p>
                </div>
              )}

              <p className="text-sm leading-relaxed text-[#7e8cb1]">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </section>

          <section className="mt-8 rounded-[34px] bg-[#232d52] px-8 py-8 shadow-[0_18px_35px_rgba(0,0,0,0.22)]">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#7e8cb1]">No account yet?</p>
            <p className="mt-3 text-[24px] leading-tight text-[#c7afff]">You can still explore the translator in guest mode.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center rounded-full border border-[#3b4a74] bg-[#1a254d] px-5 py-3 text-sm font-medium text-[#e6e8f5] transition-colors hover:bg-[#24305d]"
            >
              Continue as guest
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
