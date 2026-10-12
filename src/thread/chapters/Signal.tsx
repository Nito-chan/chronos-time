"use client"

import { useEffect, useRef } from "react"
import { CHAPTERS } from "../story"
import { ChapterShell } from "./ChapterShell"
import { useThreadStore } from "../store"

const STAMPS = [
  { at: 0.12, text: "1844 · FIRST TELEGRAPH", x: "8%", y: "22%" },
  { at: 0.3, text: "1969 · ARPANET", x: "72%", y: "30%" },
  { at: 0.48, text: "1990 · WORLD WIDE WEB", x: "12%", y: "64%" },
  { at: 0.64, text: "2007 · EVERY POCKET, A CLOCK", x: "66%", y: "68%" },
  { at: 0.8, text: "2024 · EVERY MOMENT, KEPT", x: "38%", y: "80%" },
]

/**
 * IV. Signal — pinned text; mono timestamps fade in beside events
 * as the visitor scrolls, filling the screen with dated moments.
 */
export function Signal() {
  const def = CHAPTERS[3]!
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const sec = layer.current?.closest("section")
      if (!sec || !layer.current) return
      const rect = sec.getBoundingClientRect()
      const vh = window.innerHeight
      const total = sec.offsetHeight - vh
      const frozen = useThreadStore.getState().reducedMotion
      const local = frozen ? 0.5 : Math.min(1, Math.max(0, -rect.top / total))
      layer.current.querySelectorAll<HTMLElement>("[data-at]").forEach((el) => {
        const at = parseFloat(el.dataset.at || "0")
        const on = local >= at
        el.style.opacity = on ? "1" : "0"
        el.style.transform = `translateY(${on ? "0" : "8px"})`
      })
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <ChapterShell def={def} index={3}>
      <div ref={layer} className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STAMPS.map((s) => (
          <span
            key={s.text}
            data-at={s.at}
            className="t-label absolute tabular-nums transition-all duration-500"
            style={{ left: s.x, top: s.y, color: "var(--pg-accent)", opacity: 0 }}
          >
            {s.text}
          </span>
        ))}
      </div>
    </ChapterShell>
  )
}
