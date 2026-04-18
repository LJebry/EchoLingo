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

export function UserProfile() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
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
    return <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-[#162242] px-5 text-sm font-medium text-[#eef1ff] transition-all hover:bg-[#1f2b47] active:scale-95"
      >
        Log In
      </Link>
    )
  }

  const user = session.user

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-[#131d39] p-1 pr-3 transition-all hover:bg-[#1f2b47]"
      >
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-primary">
          {user?.image ? (
            <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
          ) : (
            <User size={16} />
          )}
        </div>
        <ChevronDown size={14} className={cn("text-[#7e8cb1] transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#131d39] shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in duration-100">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-sm font-medium text-[#eef1ff] truncate">{user?.name}</p>
            <p className="text-xs text-[#7e8cb1] truncate">{user?.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#d7def7] hover:bg-white/5"
            >
              <LayoutDashboard size={16} className="text-[#c8aefc]" />
              Dashboard
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#d7def7] hover:bg-white/5"
            >
              <Settings size={16} className="text-[#c8aefc]" />
              Settings
            </Link>
          </div>
          <div className="py-1 border-t border-white/5">
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
  )
}
