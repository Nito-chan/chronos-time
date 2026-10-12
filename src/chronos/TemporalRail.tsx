"use client"

import { CHAPTERS } from "./chapters"
import { useChronosStore } from "./store"
import { cn } from "@/lib/utils"

export function TemporalRail() {
  const progress = useChronosStore((s) => s.progress)
  const chapter = useChronosStore((s) => s.chapter)

  const scrollTo = (i: number) => {
    const el = document.getElementById(`chronos-${CHAPTERS[i]!.id}`)
    el?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <nav
      aria-label="Timeline chapters"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 md:flex lg:left-8"
    >
      <div className="relative flex flex-col items-center">
        {/* track */}
        <div className="absolute bottom-2 top-2 w-px bg-white/[0.07]" />
        {/* fill */}
        <div
          className="absolute top-2 w-px bg-gradient-to-b from-[#22D3EE] to-[#8B5CF6]"
          style={{ height: `calc((100% - 16px) * ${progress})` }}
        />
        {CHAPTERS.map((c, i) => {
          const active = i === chapter
          const passed = progress * (CHAPTERS.length - 1) >= i - 0.3
          return (
            <button
              key={c.id}
              onClick={() => scrollTo(i)}
              aria-label={`Go to ${c.kicker}`}
              className="group relative flex size-8 items-center justify-center outline-none"
            >
              <span
                className={cn(
                  "block rotate-45 border transition-all duration-500",
                  active
                    ? "size-[10px] border-[#22D3EE] bg-[#22D3EE]/20 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                    : passed
                      ? "size-[7px] border-white/40 bg-white/10"
                      : "size-[6px] border-white/20 bg-transparent"
                )}
                style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
              />
              <span className="pointer-events-none absolute left-9 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-white/0 transition-all duration-300 group-hover:text-white/70 group-focus-visible:text-white/70">
                {c.kicker}
              </span>
            </button>
          )
        })}
      </div>
      <div className="mt-4 font-mono text-[10px] tracking-[0.2em] text-white/30">
        {String(chapter).padStart(2, "0")} / 06
      </div>
    </nav>
  )
}
