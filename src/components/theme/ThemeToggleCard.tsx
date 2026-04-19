"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme/ThemeProvider"
import { cn } from "@/lib/utils"

export function ThemeToggleCard() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4 rounded-2xl border border-outline-ghost/10 bg-surface-low p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-on-surface">Theme</p>
          <p className="text-sm text-support">Switch between light and dark mode.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-surface px-1 py-1">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
              theme === "light" ? "bg-pulse text-on-pulse" : "text-support hover:text-on-surface"
            )}
          >
            <Sun size={16} />
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
              theme === "dark" ? "bg-pulse text-on-pulse" : "text-support hover:text-on-surface"
            )}
          >
            <Moon size={16} />
            Dark
          </button>
        </div>
      </div>
    </div>
  )
}
