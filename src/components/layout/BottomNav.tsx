"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Translate", icon: "translate" },
  { href: "/conversations", label: "Convo", icon: "settings_voice" },
  { href: "/voices", label: "Voices", icon: "face" },
  { href: "/history", label: "History", icon: "history" },
];

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around rounded-t-[2rem] border-t border-outline-ghost/10 bg-surface-low px-4 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-[1rem] px-3 py-1.5 transition-all active:scale-95",
              isActive ? "text-pulse" : "text-support hover:text-pulse"
            )}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-sans text-[10px] font-bold uppercase tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
