import Link from "next/link"
import { cn } from "@/components/ui/Button"

interface LoginLinkButtonProps {
  href?: string
  label?: string
  className?: string
}

export function LoginLinkButton({
  href = "/login",
  label = "Log In / Sign Up",
  className,
}: LoginLinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-full border border-outline-ghost/20 px-6 py-3 text-base text-support transition-all hover:bg-surface-high active:scale-95",
        className
      )}
    >
      {label}
    </Link>
  )
}
