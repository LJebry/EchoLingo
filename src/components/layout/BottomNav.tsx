"use client"

import { Home, MessageSquare, Mic2, Settings, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/components/ui/Button'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/history', icon: MessageSquare, label: 'History' },
    { href: '/voices', icon: UserCircle, label: 'Voices' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#131b2e] border-t border-[#b9c7df]/10 px-6 py-3 pb-8 flex items-center justify-between">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-[#d0bcff]" : "text-[#b9c7df]/60 hover:text-[#b9c7df]"
            )}
          >
            <item.icon size={24} />
            <span className="text-[10px] uppercase tracking-wider font-bold">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
