"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/layout/BottomNav"

function shouldHideBottomNav(pathname: string) {
  return pathname === "/login"
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hideBottomNav = shouldHideBottomNav(pathname)

  return (
    <div className="min-h-dvh bg-[#040915] md:p-4">
      <div className="relative mx-auto min-h-dvh w-full max-w-[390px] bg-[#09142f] text-white md:min-h-[844px] md:rounded-[2rem] md:border md:border-white/10 md:shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
        <div className="min-h-dvh">{children}</div>
        {hideBottomNav ? null : <BottomNav />}
      </div>
    </div>
  )
}
