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
    <div className="min-h-svh bg-surface md:p-4">
      <div className="relative mx-auto min-h-svh w-full bg-surface-low text-on-surface md:min-h-[calc(100svh-2rem)] md:max-w-4xl md:overflow-hidden md:rounded-[2rem] md:border md:border-outline-ghost/10 md:shadow-[0_35px_90px_rgba(0,0,0,0.32)] lg:max-w-6xl xl:max-w-7xl">
        <div className="min-h-svh md:min-h-0 md:h-[calc(100svh-2rem)] md:overflow-y-auto">{children}</div>
        {hideBottomNav ? null : <BottomNav />}
      </div>
    </div>
  )
}
