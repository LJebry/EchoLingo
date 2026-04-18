import Link from "next/link"
import { Globe, User } from "lucide-react"

export function MobileHeader({
  title,
  showProfile = true,
}: {
  title: string
  showProfile?: boolean
}) {
  return (
    <header className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#c8aefc]">
          <Globe size={18} />
          <span className="text-sm font-semibold tracking-tight">EchoLingo</span>
        </div>

        {showProfile ? (
          <Link
            href="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-[#131d39] text-[#d0bcff]"
          >
            <User size={18} />
          </Link>
        ) : null}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7e8cb1]">
          Workspace
        </p>
        <h1 className="text-[2rem] font-semibold leading-none tracking-tight text-[#eef1ff]">
          {title}
        </h1>
      </div>
    </header>
  )
}
