import { Globe } from "lucide-react"
import { UserProfile } from "./UserProfile"

export function MobileHeader({
  title,
  showProfile = true,
}: {
  title: string
  showProfile?: boolean
}) {
  return (
    <header className="sticky top-0 z-40 -mx-4 space-y-5 border-b border-outline-ghost/10 bg-surface/90 px-4 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-pulse">
          <Globe size={18} />
          <span className="text-sm font-semibold tracking-tight">EchoLingo</span>
        </div>

        {showProfile ? <UserProfile /> : null}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-support">
          Workspace
        </p>
        <h1 className="text-[2rem] font-semibold leading-none tracking-tight text-on-surface">
          {title}
        </h1>
      </div>
    </header>
  )
}
