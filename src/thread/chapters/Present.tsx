"use client"

import { useEffect, useRef, useState } from "react"
import { CHAPTERS } from "../story"

function useNow() {
  const [now, setNow] = useState("--")
  useEffect(() => {
    const fmt = () =>
      new Date()
        .toLocaleString("en-GB", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .toUpperCase()
    const id = window.setInterval(() => setNow(fmt()), 1000)
    const quick = window.setTimeout(() => setNow(fmt()), 60)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(quick)
    }
  }, [])
  return now
}

/**
 * VII. Present — the ruler runs out and ends in YOU ARE HERE,
 * beside the visitor's real ticking clock. Then the ask.
 */
export function Present() {
  const def = CHAPTERS[6]!
  const now = useNow()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => el.classList.toggle("is-in", e!.isIntersecting),
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="chronos-present"
      data-chapter={6}
      aria-label="VII · Present"
      className="relative"
      style={{ minHeight: `${Math.max(def.vh, 1.2) * 100}vh` }}
    >
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-[10vh] md:px-10">
        {/* ruler run-out */}
        <div className="flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1" style={{ background: "rgba(14,18,32,0.4)" }} />
          <span className="size-2 rotate-45 border-2" style={{ borderColor: "#3347FF" }} />
          <span className="t-label">YOU ARE HERE</span>
        </div>
        <p className="t-label mt-4 tabular-nums opacity-70" aria-label={`Current time: ${now}`}>
          {now} LOCAL
        </p>

        <h2 className="t-display font-display mt-10">
          <span className="rv-mask">
            <span className="rv-line">
              You are here. <em className="italic">Where do you want to go?</em>
            </span>
          </span>
        </h2>
        <p className="t-body rv-fade mt-8" style={{ color: "var(--pg-ink2)" }}>
          {def.body}
        </p>

        <div className="rv-fade mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#chronos-instrument"
            className="btn-thread bg-[#0E1220] px-8 py-4 text-center text-[15px] font-medium text-[#ECEFF3] transition-colors hover:bg-[#3347FF]"
          >
            Start free trial
          </a>
          <a
            href="#chronos-instrument"
            className="btn-thread border px-8 py-4 text-center text-[15px] font-medium"
            style={{ borderColor: "rgba(14,18,32,0.4)" }}
          >
            Schedule demo
          </a>
        </div>

        <footer className="mt-[12vh] border-t pt-8" style={{ borderColor: "rgba(14,18,32,0.16)" }}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <p className="font-display text-lg tracking-[0.2em]">CHRONOS</p>
            <nav className="flex flex-wrap gap-6" aria-label="Footer">
              {[
                ["Instrument", "#chronos-instrument"],
                ["Genesis", "#chronos-genesis"],
                ["Signal", "#chronos-signal"],
                ["Top", "#top"],
              ].map(([label, href]) => (
                <a key={label} href={href} className="t-label opacity-70 transition-opacity hover:opacity-100">
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <p className="t-label mt-8 opacity-60">Before time was measured, they understood it.</p>
        </footer>
      </div>
    </section>
  )
}
