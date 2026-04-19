import { UserProfile } from "./UserProfile"
import { BrandLogo } from "./BrandLogo"

export function MobileHeader({
  title,
  showProfile = true,
}: {
  title: string
  showProfile?: boolean
}) {
  return (
    <header className="sticky top-0 z-40 -mx-4 space-y-5 border-b border-white/5 bg-[#09142f]/95 px-4 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="flex items-center justify-between">
        <BrandLogo markClassName="h-7 w-7" />

        {showProfile ? <UserProfile /> : null}
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
