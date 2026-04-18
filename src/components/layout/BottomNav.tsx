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
    <nav className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-2rem)] max-w-[26rem] -translate-x-1/2 md:absolute md:bottom-0 md:left-0 md:w-full md:max-w-none md:translate-x-0 md:px-6 md:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="grid w-full grid-cols-4 items-center gap-1 rounded-[1.75rem] border border-white/8 bg-[#101b39]/95 px-2 py-2 shadow-[0_-12px_35px_rgba(0,0,0,0.38)] backdrop-blur-xl md:mx-auto md:max-w-[32rem]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-[1.25rem] px-2 py-2.5 text-[#8ea0c9] transition-all duration-200 active:scale-95",
                "hover:bg-[rgba(164,92,255,0.14)] hover:text-[#e2d2ff] hover:shadow-[0_0_0_1px_rgba(164,92,255,0.22),0_0_24px_rgba(164,92,255,0.14)]",
                isActive && "bg-[#202c52] text-[#d9cbff] shadow-[0_0_0_1px_rgba(164,92,255,0.18)]"
              )}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-sans text-[10px] font-semibold tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
