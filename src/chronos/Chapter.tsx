"use client"

import { useEffect, useRef, useState } from "react"
import type { ChapterDef } from "./chapters"
import { cn } from "@/lib/utils"

function useVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setVisible(e!.isIntersecting),
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, visible }
}

export function Chapter({ def }: { def: ChapterDef }) {
  const { ref, visible } = useVisible<HTMLDivElement>()
  const words = def.body.split(" ")

  return (
    <section
      id={`chronos-${def.id}`}
      data-chapter={def.id}
      className="relative flex min-h-screen items-center justify-center px-6 py-24 md:px-12"
      style={{ minHeight: `${Math.max(100, def.durationVh * 0.66)}vh` }}
    >
      {/* giant era numeral — parallax atmosphere layer */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden",
          def.align === "left" && "md:justify-end md:pr-[8vw]",
          def.align === "right" && "md:justify-start md:pl-[8vw]"
        )}
      >
        <span
          className="font-display select-none text-[26vw] font-light leading-none tracking-tighter text-white/[0.035] blur-[1px] md:text-[18vw]"
        >
          {def.numeral}
        </span>
      </div>

      <div
        ref={ref}
        className={cn(
          "relative z-10 w-full max-w-3xl",
          def.align === "left" && "md:mr-auto md:max-w-xl md:pl-[10vw]",
          def.align === "right" && "md:ml-auto md:max-w-xl md:pr-[10vw]",
          def.align === "center" && "text-center"
        )}
      >
        <p
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.45em] text-[#22D3EE]/80",
            visible ? "chapter-visible" : "chapter-hidden"
          )}
        >
          {def.index} — {def.kicker}
        </p>
        <p
          className={cn(
            "mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 transition-all delay-100",
            visible ? "chapter-visible" : "chapter-hidden"
          )}
        >
          {def.timestamp}
        </p>

        <h2
          className={cn(
            "font-display mt-6 text-[clamp(2.2rem,6vw,4.8rem)] font-light leading-[1.02] tracking-[-0.02em] text-[#F5F5F5] transition-all delay-150",
            visible ? "chapter-visible" : "chapter-hidden"
          )}
        >
          {def.title}
          <br />
          <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">
            {def.titleAccent}
          </span>
        </h2>

        <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-[#A3A3A3] md:text-base">
          {words.map((w, i) => (
            <span
              key={i}
              className={cn("inline-block", visible ? "chapter-visible" : "chapter-hidden")}
              style={{ transitionDelay: `${200 + i * 28}ms` }}
            >
              {w}
              {"\u00A0"}
            </span>
          ))}
        </p>

        {/* broken rule — every circle broken */}
        <div
          className={cn(
            "mt-8 flex items-center gap-3 transition-all delay-500",
            def.align === "center" && "justify-center",
            visible ? "chapter-visible" : "chapter-hidden"
          )}
        >
          <span className="h-px w-14 bg-gradient-to-r from-[#22D3EE]/60 to-transparent" />
          <span className="block size-1.5 rotate-45 border border-[#22D3EE]/60" />
          <span className="h-px w-6 bg-white/10" />
        </div>
      </div>
    </section>
  )
}
