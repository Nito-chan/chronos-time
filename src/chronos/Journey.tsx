"use client"

import { useEffect, useRef, Suspense } from "react"
import dynamic from "next/dynamic"
import { CHAPTERS } from "./chapters"
import { useChronosStore } from "./store"
import { SmoothScroll } from "./SmoothScroll"
import { TemporalRail } from "./TemporalRail"
import { SiteFrame } from "./SiteFrame"
import { Chapter } from "./Chapter"
import { Instrument } from "./Instrument"

const ChronosCanvas = dynamic(
  () => import("./ChronosCanvas").then((m) => ({ default: m.ChronosCanvas })),
  { ssr: false, loading: () => null }
)

function Loader() {
  const ready = useChronosStore((s) => s.ready)
  if (ready) return null
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#050505]">
      <svg viewBox="0 0 64 64" className="chronos-loader-arc size-12" aria-hidden>
        <circle cx="32" cy="32" r="24" fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="110 41" strokeLinecap="round" opacity="0.9" />
        <circle cx="32" cy="32" r="15" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="70 25" strokeLinecap="round" opacity="0.6" />
        <circle cx="32" cy="32" r="2.5" fill="#F5F5F5" />
      </svg>
      <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/40">Assembling time</p>
    </div>
  )
}

export function Journey() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      const p = total > 0 ? scrolled / total : 0
      useChronosStore.getState().setProgress(p)
      const idx = Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length))
      useChronosStore.getState().setChapter(idx)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <main className="relative bg-[#050505]">
      <SmoothScroll />
      <Loader />
      <SiteFrame />
      <TemporalRail />

      {/* single persistent WebGL world */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <Suspense fallback={null}>
          <ChronosCanvas />
        </Suspense>
      </div>

      {/* scroll track — chapters float above the world */}
      <div ref={trackRef} className="relative z-10">
        {/* hero monument */}
        <section id="chronos-void" data-chapter="void" className="flex min-h-[110vh] flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-white/40">Chronos presents</p>
          <h1 className="font-display mt-6 text-[clamp(3.8rem,13vw,11rem)] font-light leading-[0.88] tracking-[-0.04em] text-[#F5F5F5]">
            CHRONOS
          </h1>
          <p className="mt-6 text-[clamp(0.95rem,2vw,1.35rem)] font-light uppercase tracking-[0.3em] text-[#A3A3A3]">
            The Operating System For Time
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.35em] text-white/30">
            Observe · Simulate · Navigate
          </p>
        </section>

        {CHAPTERS.slice(1, 6).map((c) => (
          <Chapter key={c.id} def={c} />
        ))}

        <Instrument />
      </div>
    </main>
  )
}
