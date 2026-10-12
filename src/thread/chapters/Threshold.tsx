"use client"

import { useEffect, useRef } from "react"
import { THRESHOLD_VH } from "../story"

/**
 * Threshold: pure black, one point of light (canvas), mono counter,
 * "Hold still…" line and "Scroll to begin" prompt. h1 lives here.
 */
export function Threshold() {
  const ref = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("is-in", e!.isIntersecting),
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // counter ticks from T−13,800,000,000 while threshold is on screen
  useEffect(() => {
    let raf = 0
    const base = 13_800_000_000
    const t0 = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const el = counterRef.current
      if (!el) return
      const rect = ref.current?.getBoundingClientRect()
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return
      const drift = Math.floor((now - t0) / 1200)
      const val = (base - drift).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      el.textContent = `T−${val} YEARS`
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section
      ref={ref}
      id="chronos-threshold"
      aria-label="Threshold — before time"
      className="relative flex items-center justify-center"
      style={{ minHeight: `${THRESHOLD_VH * 100}vh` }}
    >
      <div className="text-plane flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-light leading-none tracking-[0.08em]">
          <span className="rv-mask">
            <span className="rv-line">CHRONOS</span>
          </span>
        </h1>
        <p className="t-label rv-fade mt-6" style={{ color: "var(--pg-ink2)" }}>
          The Operating System For Time
        </p>
        <p ref={counterRef} className="t-label rv-fade mt-14 tabular-nums" aria-live="off">
          T−13,800,000,000 YEARS
        </p>
        <p className="rv-fade mt-4 text-base" style={{ color: "var(--pg-ink2)" }}>
          Hold still. Nothing has happened yet.
        </p>
        <p className="t-label rv-fade mt-10 animate-pulse">Scroll to begin</p>
      </div>
    </section>
  )
}
