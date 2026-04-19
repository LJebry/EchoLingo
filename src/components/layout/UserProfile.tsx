"use client"

import { useState, useRef, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { 
  User,
  LogOut, 
  LayoutDashboard, 
  Settings,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeIconToggle } from "@/components/theme/ThemeIconToggle"

export function UserProfile() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [imgError, setImgError] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (status === "loading") {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-surface-high" />
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <ThemeIconToggle />
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-full border border-outline-ghost/10 bg-surface-high px-5 text-sm font-medium text-on-surface transition-all hover:bg-surface-highest active:scale-95"
        >
          Log In
        </Link>
      </div>
    )
  }

  const user = session.user

  return (
    <div className="flex items-center gap-2">
      <ThemeIconToggle />
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full border border-outline-ghost/10 bg-surface-high p-1 pr-3 transition-all hover:bg-surface-highest"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-pulse/15 text-pulse shadow-inner">
            {user?.image && !imgError ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <User size={16} />
            )}
          </div>
          <ChevronDown size={14} className={cn("text-support transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl border border-outline-ghost/10 bg-surface-high shadow-2xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in duration-100">
            <div className="border-b border-outline-ghost/10 px-4 py-3">
              <p className="truncate text-sm font-medium text-on-surface">{user?.name}</p>
              <p className="truncate text-xs text-support">{user?.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-highest"
              >
                <LayoutDashboard size={16} className="text-pulse" />
                Dashboard
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-highest"
              >
                <Settings size={16} className="text-pulse" />
                Settings
              </Link>
            </div>
            <div className="border-t border-outline-ghost/10 py-1">
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
