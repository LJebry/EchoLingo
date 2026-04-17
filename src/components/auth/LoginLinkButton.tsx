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
        "inline-flex w-full items-center justify-center rounded-full border border-[#b9c7df]/20 px-6 py-3 text-base text-[#b9c7df] transition-all hover:bg-[#b9c7df]/10 active:scale-95",
        className
      )}
    >
      {label}
    </Link>
  )
}
