"use client"

import { usePathname, useRouter } from "next/navigation"
import { History, Languages, MessageCircle, Mic2 } from "lucide-react"
import { Dock } from "@/components/ui/dock-two"

const navItems = [
  { href: "/", label: "Translate", icon: Languages },
  { href: "/conversations", label: "Convo", icon: MessageCircle },
  { href: "/voices", label: "Voices", icon: Mic2 },
  { href: "/history", label: "History", icon: History },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const items = navItems.map((item) => ({
    icon: item.icon,
    label: item.label,
    active: pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
    onClick: () => router.push(item.href),
  }))

  return (
    <nav className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-2rem)] max-w-[26rem] -translate-x-1/2 md:absolute md:bottom-0 md:left-0 md:w-full md:max-w-none md:translate-x-0 md:px-6 md:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Dock items={items} />
    </nav>
  )
}
