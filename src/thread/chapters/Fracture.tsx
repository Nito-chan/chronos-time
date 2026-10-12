"use client"

import { useEffect, useRef } from "react"
import { CHAPTERS } from "../story"
import { useThreadStore } from "../store"

/**
 * III. Fracture — the only hard transition.
 * The layout splits along a diagonal seam revealing brassworks behind.
 * Gear rotation speed follows scroll velocity.
 */
export function Fracture() {
  const def = CHAPTERS[2]!
  const outer = useRef<HTMLElement>(null)
  const halfA = useRef<HTMLDivElement>(null)
  const halfB = useRef<HTMLDivElement>(null)
  const gears = useRef<HTMLDivElement>(null)
  const spin = useRef(0)

  useEffect(() => {
    let raf = 0
    let lastY = window.scrollY
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const o = outer.current
      if (!o) return
      const y = window.scrollY
      const rawVel = y - lastY
      lastY = y
      const frozen = useThreadStore.getState().reducedMotion
      const vel = frozen ? 0 : rawVel
      if (!frozen) spin.current += 0.4 + Math.min(40, Math.abs(vel)) * 0.35
      const rect = o.getBoundingClientRect()
      const vh = window.innerHeight
      const total = o.offsetHeight - vh
      const local = frozen ? 0.5 : Math.min(1, Math.max(0, -rect.top / total))
      // seam opens 0.3 → 0.62
      const open = Math.min(1, Math.max(0, (local - 0.3) / 0.32))
      const eased = open * open * (3 - 2 * open)
      const shift = eased * Math.max(window.innerWidth, window.innerHeight) * 0.55
      if (halfA.current) halfA.current.style.transform = `translate(${-shift}px,${-shift * 0.55}px)`
      if (halfB.current) halfB.current.style.transform = `translate(${shift}px,${shift * 0.55}px)`
      gears.current?.querySelectorAll<HTMLElement>("[data-gear]").forEach((g) => {
        const dir = g.dataset.gear === "r" ? -1 : 1
        const sp = parseFloat(g.dataset.speed || "1")
        g.style.transform = `rotate(${dir * spin.current * sp}deg)`
      })
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const el = outer.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("is-in", e!.isIntersecting),
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={outer}
      id="chronos-fracture"
      data-chapter={2}
      aria-label="III · Fracture · 1760"
      className="relative"
      style={{ minHeight: `${def.vh * 100}vh` }}
    >
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        {/* behind: brassworks */}
        <div className="absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse at 62% 44%, rgba(212,166,74,0.16), transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(122,59,36,0.22), transparent 50%)" }} />
        <div ref={gears} className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          {[
            { s: 300, x: "60%", y: "40%", sp: "1", dir: "f", c: "#D4A64A" },
            { s: 190, x: "38%", y: "58%", sp: "1.6", dir: "r", c: "#7A3B24" },
            { s: 120, x: "70%", y: "62%", sp: "2.3", dir: "f", c: "#FFB84D" },
          ].map((g, i) => (
            <svg key={i} data-gear={g.dir} data-speed={g.sp} viewBox="0 0 100 100"
              className="absolute opacity-50"
              style={{ width: g.s, height: g.s, left: g.x, top: g.y }}>
              <g fill="none" stroke={g.c} strokeWidth="3">
                <circle cx="50" cy="50" r="30" />
                <circle cx="50" cy="50" r="8" />
                {Array.from({ length: 12 }).map((_, k) => {
                  const a = (k / 12) * Math.PI * 2
                  return (
                    <line key={k} x1={50 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30}
                      x2={50 + Math.cos(a) * 40} y2={50 + Math.sin(a) * 40} />
                  )
                })}
              </g>
            </svg>
          ))}
        </div>

        {/* front stone halves along a diagonal seam */}
        <div ref={halfA} className="absolute inset-0 will-change-transform" aria-hidden="true"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 32%, 0 68%)",
            background: "linear-gradient(180deg, #241D16, #171310)",
          }} />
        <div ref={halfB} className="absolute inset-0 will-change-transform" aria-hidden="true"
          style={{
            clipPath: "polygon(0 68%, 100% 32%, 100% 100%, 0 100%)",
            background: "linear-gradient(180deg, #1B1512, #100D0B)",
          }} />
        {/* seam glow line */}
        <div className="absolute inset-0" aria-hidden="true"
          style={{ background: "linear-gradient(18deg, transparent 49.4%, rgba(255,184,77,0.55) 50%, transparent 50.6%)" }} />

        <span aria-hidden="true" className="chapter-numeral -right-[6vw] top-[8vh]">
          {def.numeral}
        </span>
        <div className="scrim" aria-hidden="true" />

        <div className="text-plane relative grid w-full grid-cols-12 gap-4 px-6 md:px-10">
          <div className="col-span-12 md:col-span-6 md:col-start-2">
            <p className="t-label rv-type" style={{ color: "var(--pg-accent)" }}>
              {def.numeral} · {def.label} · {def.date}
            </p>
            <h2 className="t-display font-display mt-6">
              <span className="rv-mask">
                <span className="rv-line">
                  Then time got <em className="italic">a schedule.</em>
                </span>
              </span>
            </h2>
            <p className="t-body rv-fade mt-8" style={{ color: "var(--pg-ink2)" }}>
              {def.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
