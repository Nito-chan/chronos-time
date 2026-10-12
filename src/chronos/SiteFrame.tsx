"use client"

import { useEffect, useState } from "react"
import { useChronosStore } from "./store"

function useElapsed() {
  const [t, setT] = useState("T+00:00:00")
  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000)
      const hh = String(Math.floor(s / 3600)).padStart(2, "0")
      const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0")
      const ss = String(s % 60).padStart(2, "0")
      setT(`T+${hh}:${mm}:${ss}`)
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export function SiteFrame() {
  const progress = useChronosStore((s) => s.progress)
  const chapter = useChronosStore((s) => s.chapter)
  const elapsed = useElapsed()

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between px-6 md:px-10">
        <a href="#chronos-void" className="flex items-center gap-3 outline-none focus-visible:ring-1 focus-visible:ring-[#22D3EE]">
          <span className="relative block size-5">
            {/* broken arc mark */}
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              <circle
                cx="10"
                cy="10"
                r="7.5"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.5"
                strokeDasharray="38 9"
                strokeLinecap="round"
                transform="rotate(-40 10 10)"
              />
              <circle cx="15.5" cy="6.5" r="1.4" fill="#22D3EE" />
            </svg>
          </span>
          <span className="font-display text-[13px] font-medium tracking-[0.28em] text-[#F5F5F5]">
            CHR<span className="fracture-c">O</span>NOS
          </span>
        </a>

        <div className="hidden items-center gap-6 font-mono text-[10px] tracking-[0.25em] text-white/40 sm:flex">
          <span>{elapsed}</span>
          <span className="flex items-center gap-2 text-emerald-300/80">
            <span className="chronos-breathe inline-block size-1.5 rounded-full bg-emerald-400" />
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#chronos-instrument"
            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] font-medium tracking-wide text-[#F5F5F5] backdrop-blur-md transition-all duration-200 hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/10"
            style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          >
            Enter the Timeline
          </a>
        </div>
      </header>

      {/* scroll breath — thin arc progress */}
      <div className="fixed inset-x-0 top-0 z-40 h-px bg-white/[0.05]">
        <div
          className="h-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#D4A853]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* bottom breath indicator */}
      <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
        <div className="font-mono text-[10px] tracking-[0.4em] text-white/35">
          {chapter === 0 ? "SCROLL TO DESCEND" : `BREATH 0${chapter} — INHALE`}
        </div>
        <div className="h-8 w-px overflow-hidden bg-white/10">
          <div
            className="w-full bg-[#22D3EE] transition-transform duration-300"
            style={{
              height: "100%",
              transform: `translateY(${(1 - (progress * 7) % 1) * 100}%)`,
            }}
          />
        </div>
      </div>
    </>
  )
}
