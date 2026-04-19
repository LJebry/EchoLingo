import Image from "next/image"
import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  markClassName?: string
  textClassName?: string
  showText?: boolean
}

export function BrandLogo({
  className,
  markClassName,
  textClassName,
  showText = true,
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center",
          markClassName
        )}
      >
        <Image
          src="/echolingo-mark.svg"
          alt="Echolingo"
          width={32}
          height={32}
          priority
          className="h-8 w-8"
        />
      </span>
      {showText ? (
        <span
          className={cn(
            "font-display text-sm font-semibold tracking-tight text-pulse",
            textClassName
          )}
        >
          EchoLingo
        </span>
      ) : null}
    </div>
  )
}
