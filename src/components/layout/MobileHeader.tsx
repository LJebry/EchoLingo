import { User } from 'lucide-react'
import Link from 'next/link'

export function MobileHeader({ title, showProfile = true }: { title: string, showProfile?: boolean }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b1326]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-[#dae2fd]">{title}</h1>
      {showProfile && (
        <Link href="/settings" className="w-10 h-10 rounded-full bg-[#131b2e] flex items-center justify-center text-[#d0bcff]">
          <User size={20} />
        </Link>
      )}
    </header>
  )
}
