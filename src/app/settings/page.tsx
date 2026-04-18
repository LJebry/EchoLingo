import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { Button } from "@/components/ui/Button"
import { LogOut, Shield, User } from "lucide-react"
import { ThemeToggleCard } from "@/components/theme/ThemeToggleCard"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  return (
    <div className="space-y-8 px-4 pb-28 pt-5">
      <MobileHeader title="Settings" />

      <div className="flex flex-col items-center gap-4 py-4">
        <div className="h-24 w-24 rounded-full bg-pulse p-1">
          <Image 
            src={session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`} 
            width={96}
            height={96}
            className="h-full w-full rounded-full bg-surface object-cover"
            alt={session.user.name || "User"}
          />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-on-surface">{session.user.name}</h3>
          <p className="text-support/70">{session.user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <ThemeToggleCard />

        <div className="space-y-4 rounded-2xl border border-outline-ghost/10 bg-surface-low p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-pulse" />
              <span className="font-bold text-on-surface">Privacy Mode</span>
            </div>
            <div className="relative h-6 w-12 rounded-full bg-pulse">
              <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
            </div>
          </div>
          <div className="h-px bg-outline-ghost/10" />
          <div className="flex items-center gap-3">
            <User size={20} className="text-support/70" />
            <span className="font-bold text-on-surface">Edit Profile</span>
          </div>
        </div>

        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button variant="ghost" className="w-full text-red-400 border-red-400/20 hover:bg-red-400/10">
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </form>
      </div>

      <div className="space-y-2 pt-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-support/40">EchoLingo v1.0.0-mvp</p>
        <p className="px-8 text-[10px] leading-relaxed text-support/30">
          Crafted for the global citizen. All rights reserved.
        </p>
      </div>
    </div>
  )
}
