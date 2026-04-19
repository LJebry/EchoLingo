"use client"

import * as React from "react"
import { motion, type Variants } from "framer-motion"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DockProps {
  className?: string
  items: {
    icon: LucideIcon
    label: string
    onClick?: () => void
    active?: boolean
  }[]
}

interface DockIconButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  active?: boolean
  className?: string
}

const floatingAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, active = false, className }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative rounded-lg p-3 transition-colors",
          "text-support hover:bg-surface-high hover:text-pulse",
          active && "bg-pulse/12 text-pulse shadow-[0_0_0_1px_rgba(var(--color-pulse),0.14)]",
          className
        )}
      >
        <Icon className="h-5 w-5" />
        <span
          className={cn(
            "pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap",
            "rounded bg-surface-high px-2 py-1 text-xs text-on-surface shadow-lg",
            "opacity-0 transition-opacity group-hover:opacity-100"
          )}
        >
          {label}
        </span>
      </motion.button>
    )
  }
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(({ items, className }, ref) => {
  return (
    <div ref={ref} className={cn("flex w-full items-center justify-center p-2", className)}>
      <div className="flex w-full max-w-4xl items-center justify-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          className={cn(
            "flex items-center gap-1 rounded-2xl p-2",
            "border border-outline-ghost/10 bg-surface/90 shadow-lg backdrop-blur-lg",
            "transition-shadow duration-300 hover:shadow-xl"
          )}
        >
          {items.map((item) => (
            <DockIconButton key={item.label} {...item} />
          ))}
        </motion.div>
      </div>
    </div>
  )
})
Dock.displayName = "Dock"

export { Dock }
