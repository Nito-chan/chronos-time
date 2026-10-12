"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const INSTRUMENTS = [
  {
    id: "observe",
    title: "Observe",
    desc: "Navigate 13.8B years with millisecond precision. Every era, every event — one vantage point.",
    arc: 282,
    color: "#22D3EE",
    stat: "1.2M",
    statLabel: "events indexed",
  },
  {
    id: "simulate",
    title: "Simulate",
    desc: "Branch alternate histories. Watch how one decision reshapes empires across probability strands.",
    arc: 210,
    color: "#8B5CF6",
    stat: "42",
    statLabel: "civilizations tracked",
  },
  {
    id: "navigate",
    title: "Navigate",
    desc: "Travel the timeline like space. Temporal API + neural interface that learns how you explore.",
    arc: 318,
    color: "#D4A853",
    stat: "99.97%",
    statLabel: "temporal accuracy",
  },
]

function Radial({ arc, color, active }: { arc: number; color: string; active: boolean }) {
  const r = 54
  const c = 2 * Math.PI * r
  const shown = (arc / 360) * c
  return (
    <svg viewBox="0 0 128 128" className="size-32 md:size-36" aria-hidden>
      <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" strokeDasharray={`${c - 26} 26`} strokeLinecap="round" transform="rotate(115 64 64)" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${shown - 14} ${c - shown + 14}`}
        transform="rotate(115 64 64)"
        opacity={active ? 1 : 0.45}
        style={{ transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1)", filter: active ? `drop-shadow(0 0 10px ${color}66)` : "none" }}
      />
      <rect x="60.5" y="60.5" width="7" height="7" transform="rotate(45 64 64)" fill="none" stroke={color} strokeWidth="1.4" />
    </svg>
  )
}

export function Instrument() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e!.isIntersecting && setVisible(true), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="chronos-instrument" data-chapter="instrument" className="relative z-10 px-6 pb-32 pt-10 md:px-12">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-6xl rounded-2xl border border-white/[0.07] bg-[#0d0d0f]/80 p-8 backdrop-blur-2xl md:p-14",
          visible ? "chapter-visible" : "chapter-hidden"
        )}
        style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.45em] text-[#22D3EE]/80">VI — The Instrument</p>
            <h2 className="font-display mt-4 text-[clamp(2rem,5vw,3.6rem)] font-light leading-none tracking-tight text-white">
              The story becomes <span className="bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] bg-clip-text text-transparent">a tool.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-emerald-300/80">
            <span className="chronos-breathe inline-block size-1.5 rounded-full bg-emerald-400" />
            SYSTEM ONLINE
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.06] md:grid-cols-3">
          {INSTRUMENTS.map((ins) => (
            <div key={ins.id} className="group flex flex-col items-center bg-[#0A0A0A] p-8 text-center transition-colors duration-500 hover:bg-[#101014]">
              <Radial arc={ins.arc} color={ins.color} active={visible} />
              <h3 className="font-display mt-6 text-xl font-normal tracking-wide text-white">{ins.title}</h3>
              <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-[#737373]">{ins.desc}</p>
              <div className="mt-6 font-mono">
                <div className="text-2xl font-medium" style={{ color: ins.color }}>{ins.stat}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/35">{ins.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 md:flex-row md:p-8">
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-light text-white">Ready to explore the timeline?</p>
            <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-white/40">NO CREDIT CARD — FREE TIER INCLUDES FULL TIMELINE</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#chronos-void"
              className="rounded-md bg-[#F5F5F5] px-7 py-3 text-sm font-medium text-black transition-all duration-200 hover:scale-[1.02] hover:bg-white"
            >
              Start free trial
            </a>
            <a
              href="#chronos-void"
              className="rounded-md border border-white/12 px-7 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:border-[#22D3EE]/50 hover:text-white"
            >
              Schedule demo
            </a>
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-16 max-w-6xl flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
        <p className="font-display text-xs tracking-[0.3em] text-white/50">CHRONOS</p>
        <p className="max-w-md text-center font-mono text-[10px] leading-relaxed tracking-[0.15em] text-white/25 md:text-right">
          SET IN SPACE GROTESK · INTER · JETBRAINS MONO — BEFORE TIME WAS MEASURED, THEY UNDERSTOOD IT.
        </p>
      </footer>
    </section>
  )
}
