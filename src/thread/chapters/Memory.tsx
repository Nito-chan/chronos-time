"use client"

import { useEffect, useRef } from "react"
import { CHAPTERS } from "../story"
import { useThreadStore } from "../store"
import { cn } from "@/lib/utils"

const GLYPHS = ["𓇳", "𓏏", "𓊵", "𓎟", "𓇋", "𓈖", "☉", "☽", "✳"]

/**
 * II. Memory — horizontal stone corridor (desktop), vertical (phone).
 * Scroll axis switches: vertical scroll drives horizontal travel.
 * Sundial shadow length + angle tied to scroll progress.
 */
export function Memory() {
  const def = CHAPTERS[1]!
  const outer = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const shadow = useRef<HTMLDivElement>(null)
  const stone = useRef<HTMLDivElement>(null)
  const rot = useRef(0)

  useEffect(() => {
    let raf = 0
    let lastY = window.scrollY
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const o = outer.current
      const t = track.current
      if (!o || !t) return
      const y = window.scrollY
      const rawVel = y - lastY
      lastY = y
      const frozen = useThreadStore.getState().reducedMotion
      const vel = frozen ? 0 : rawVel
      rot.current += vel * 0.02
      const rect = o.getBoundingClientRect()
      const vh = window.innerHeight
      const total = o.offsetHeight - vh
      const local = frozen ? 0.5 : Math.min(1, Math.max(0, -rect.top / total))
      const mobile = window.innerWidth < 768
      if (!mobile) {
        const max = t.scrollWidth - window.innerWidth
        t.style.transform = `translate3d(${-local * max}px,0,0)`
        t.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
          const d = parseFloat(el.dataset.depth || "0")
          el.style.transform = `translate3d(${local * d * max * 0.35}px,0,0)`
        })
      } else {
        t.style.transform = "none"
        t.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
          el.style.transform = "none"
        })
      }
      // sundial: shadow sweeps as the day passes
      if (shadow.current) {
        const ang = -58 + local * 116
        const len = 1.5 - Math.sin(local * Math.PI) * 0.75
        shadow.current.style.transform = `rotate(${ang}deg) scaleY(${len})`
      }
      if (stone.current) {
        stone.current.style.transform = `translate3d(${mobile ? 0 : local * -40}px,0,0) rotate(${rot.current * 0.01}deg)`
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const el = outer.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("is-in", e!.isIntersecting),
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={outer}
      id="chronos-memory"
      data-chapter={1}
      aria-label="II · Memory · 3000 BCE"
      className="relative"
      style={{ minHeight: `${def.vh * 100}vh` }}
    >
      <span aria-hidden="true" className="chapter-numeral -left-[6vw] top-[8vh]">
        {def.numeral}
      </span>
      <div className="scrim" aria-hidden="true" />

      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div ref={track} className="flex w-full flex-col gap-10 px-6 will-change-transform md:w-max md:flex-row md:items-center md:gap-[8vw] md:px-[8vw]">
          {/* text panel */}
          <div className="text-plane w-[86vw] shrink-0 md:w-[38vw]">
            <p className="t-label rv-type" style={{ color: "var(--pg-accent)" }}>
              {def.numeral} · {def.label} · {def.date}
            </p>
            <h2 className="t-display font-display mt-6">
              <span className="rv-mask">
                <span className="rv-line">
                  Someone cut a mark in stone. <em className="italic">That was the first clock.</em>
                </span>
              </span>
            </h2>
            <p className="t-body rv-fade mt-8" style={{ color: "var(--pg-ink2)" }}>
              {def.body}
            </p>
          </div>

          {/* corridor panels */}
          {[0, 1, 2].map((p) => (
            <div key={p} className="relative hidden h-[62vh] w-[30vw] shrink-0 overflow-hidden rounded-sm md:block" data-depth={String(0.3 + p * 0.25)}
              style={{ border: "1px solid color-mix(in srgb, currentColor 16%, transparent)" }}
            >
              {/* strata */}
              <div className="absolute inset-0" aria-hidden="true"
                style={{ background: `repeating-linear-gradient(${(p * 7 - 4) % 6}deg, transparent 0 26px, color-mix(in srgb, #C9893B 14%, transparent) 26px 28px, transparent 28px 64px)` }} />
              {/* glyphs + star chart */}
              <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-6 p-10" aria-hidden="true">
                {GLYPHS.map((g, i) => (
                  <span key={i} className="font-display text-4xl opacity-50" style={{ color: i % 3 ? "var(--pg-ink2)" : "var(--pg-accent)" }}>
                    {g}
                  </span>
                ))}
                <svg viewBox="0 0 200 120" className="mt-4 w-3/4 opacity-60" aria-hidden="true">
                  <circle cx="100" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="100" cy="60" r="28" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 4" />
                  {[[60, 40], [130, 48], [100, 88], [148, 80], [74, 76]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="2" fill="currentColor" />
                  ))}
                  <line x1="60" y1="40" x2="130" y2="48" stroke="currentColor" strokeWidth="0.75" />
                  <line x1="130" y1="48" x2="100" y2="88" stroke="currentColor" strokeWidth="0.75" />
                </svg>
              </div>
              <p className="t-label absolute bottom-4 left-5 opacity-70">
                {["STRATUM · SEDIMENT", "STAR CHART · LAPIS", "TALLY · 360 MARKS"][p]}
              </p>
            </div>
          ))}

          {/* standing stone + sundial */}
          <div className="relative flex h-[62vh] w-[86vw] shrink-0 items-end justify-center md:w-[26vw]">
            <div ref={stone} className="relative h-[46vh] w-16 will-change-transform md:w-20"
              style={{ background: "linear-gradient(180deg, #4A4038, #241D16)", clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }} aria-hidden="true" />
            <div ref={shadow} className="absolute bottom-6 left-1/2 h-2 w-[30vw] origin-left md:w-[20vw]"
              style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.55), transparent)" }} aria-hidden="true" />
            <p className="t-label absolute -bottom-2 opacity-70">GNOMON · THE DAY PASSES AS YOU MOVE</p>
          </div>
        </div>
      </div>

      {/* phone: stacked copy of panels for vertical reading */}
      <div className={cn("px-6 pb-24 md:hidden")}>
        <div className="rounded-sm border border-white/15 p-8">
          <p className="t-label opacity-70">Stratum · Sediment</p>
          <div className="mt-4 flex flex-wrap gap-4" aria-hidden="true">
            {GLYPHS.slice(0, 6).map((g, i) => (
              <span key={i} className="font-display text-3xl opacity-60">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
