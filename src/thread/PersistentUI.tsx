"use client"

import { useEffect, useRef } from "react"
import { useThreadStore, scrollSnapshot } from "./store"
import { CHAPTERS } from "./story"
import { ybpAtProgress, formatCounter, formatEraDate } from "./time"
import { jumpToId } from "./SmoothScroll"
import { soundChapter, soundOff } from "./sound"

/** Log position (0 top → 1 bottom) of a ybp value on the rail. */
function railPos(ybp: number): number {
  const max = Math.log10(13_800_000_000 + 20)
  const min = Math.log10(0 + 20)
  const v = Math.log10(Math.max(0, ybp) + 20)
  return (max - v) / (max - min)
}

const TICKS = [
  { id: "chronos-genesis", name: "Genesis", date: "13.8 BYA", ybp: 13_800_000_000 },
  { id: "chronos-memory", name: "Memory", date: "3000 BCE", ybp: 5025 },
  { id: "chronos-fracture", name: "Fracture", date: "1760", ybp: 266 },
  { id: "chronos-signal", name: "Signal", date: "1990", ybp: 36 },
  { id: "chronos-synthesis", name: "Synthesis", date: "2042 · PROJECTED", ybp: -16 },
]

const NAMES = ["Threshold", ...CHAPTERS.map((c) => `${c.numeral} · ${c.label}`)]

export function PersistentUI() {
  const chapter = useThreadStore((s) => s.chapterIndex)
  const soundOn = useThreadStore((s) => s.soundOn)
  const paused = useThreadStore((s) => s.paused)
  const counter = useRef<HTMLParagraphElement>(null)
  const marker = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const cursorLabel = useRef<HTMLSpanElement>(null)
  const mouse = useRef({ x: -100, y: -100, cx: -100, cy: -100, hot: false })

  // counter + rail marker + cursor, all via direct DOM (no re-render)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const p = scrollSnapshot.displayProgress
      const ybp = ybpAtProgress(p)
      if (counter.current) {
        const txt = formatCounter(ybp)
        if (counter.current.textContent !== txt) counter.current.textContent = txt
      }
      if (marker.current) {
        marker.current.style.top = `${railPos(ybp) * 100}%`
      }
      if (bar.current) {
        bar.current.style.transform = `scaleX(${p})`
      }
      // cursor follow
      const m = mouse.current
      m.cx += (m.x - m.cx) * 0.2
      m.cy += (m.y - m.cy) * 0.2
      if (cursor.current) {
        cursor.current.style.transform = `translate(${m.cx}px,${m.cy}px)`
        cursor.current.classList.toggle("is-hot", m.hot)
      }
      if (cursorLabel.current) {
        cursorLabel.current.style.transform = `translate(${m.cx + 14}px,${m.cy - 22}px)`
        const txt = formatEraDate(ybp)
        if (cursorLabel.current.textContent !== txt) cursorLabel.current.textContent = txt
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // mouse tracking + hot state
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      mouse.current.hot = !!t.closest("a,button,[role='slider'],[role='listbox'],[role='option']")
    }
    window.addEventListener("mousemove", move, { passive: true })
    window.addEventListener("mouseover", over, { passive: true })
    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseover", over)
    }
  }, [])

  // sound follows chapter while enabled
  useEffect(() => {
    if (soundOn) soundChapter(chapter + 1, true)
    else soundOff()
  }, [soundOn, chapter])

  // pause class kills CSS animation
  useEffect(() => {
    document.body.classList.toggle("motion-paused", paused)
  }, [paused])

  const togglePause = () => useThreadStore.getState().setPaused(!paused)

  return (
    <>
      {/* wordmark */}
      <a href="#top" aria-label="CHRONOS — back to top"
        className="t-label fixed left-6 top-5 z-40 opacity-90 transition-opacity hover:opacity-100 md:left-10">
        CHRONOS
      </a>

      {/* counter */}
      <p ref={counter} aria-hidden="true"
        className="t-label fixed right-6 top-5 z-40 tabular-nums opacity-80 md:right-10">
        T−13,800,000,000 YRS
      </p>

      {/* chapter label */}
      <p aria-live="polite" className="t-label fixed bottom-6 left-6 z-40 opacity-80 md:left-10">
        <span key={chapter} className="rv-fade is-in" style={{ display: "inline-block" }}>
          {NAMES[chapter + 1]}
        </span>
      </p>

      {/* sound + pause */}
      <div className="fixed bottom-5 right-6 z-40 flex gap-2 md:right-10">
        <button
          onClick={togglePause}
          aria-pressed={paused}
          aria-label={paused ? "Resume motion" : "Pause motion"}
          className="t-label border px-3 py-2 opacity-80 transition-opacity hover:opacity-100"
          style={{ borderColor: "color-mix(in srgb, currentColor 30%, transparent)", background: "color-mix(in srgb, currentColor 6%, transparent)" }}
        >
          {paused ? "▶ MOTION" : "❚❚ MOTION"}
        </button>
        <button
          onClick={() => useThreadStore.getState().setSoundOn(!soundOn)}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Mute ambient sound" : "Enable ambient sound"}
          className="t-label border px-3 py-2 opacity-80 transition-opacity hover:opacity-100"
          style={{ borderColor: "color-mix(in srgb, currentColor 30%, transparent)", background: "color-mix(in srgb, currentColor 6%, transparent)" }}
        >
          {soundOn ? "♪ ON" : "♪ OFF"}
        </button>
      </div>

      {/* time rail — desktop */}
      <nav aria-label="Timeline — jump to chapter" className="fixed left-6 top-1/2 z-40 hidden h-[46vh] -translate-y-1/2 lg:block">
        <div className="relative h-full w-6">
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2" style={{ background: "color-mix(in srgb, currentColor 20%, transparent)" }} aria-hidden="true" />
          <div ref={marker} className="absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45"
            style={{ background: "var(--pg-accent)", boxShadow: "0 0 10px var(--pg-accent)" }} aria-hidden="true" />
          {TICKS.map((t) => (
            <button
              key={t.id}
              onClick={() => jumpToId(t.id)}
              className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-2"
              style={{ top: `${railPos(t.ybp) * 100}%` }}
              aria-label={`Jump to ${t.name}, ${t.date}`}
            >
              <span className="block h-px w-4 transition-all group-hover:w-6" style={{ background: "currentColor", opacity: 0.7 }} aria-hidden="true" />
              <span className="t-label pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {t.name} · {t.date}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* progress bar — phone */}
      <div className="fixed inset-x-0 top-0 z-40 h-[3px] lg:hidden" style={{ background: "color-mix(in srgb, currentColor 12%, transparent)" }} aria-hidden="true">
        <div ref={bar} className="h-full w-full origin-left" style={{ background: "var(--pg-accent)", transform: "scaleX(0)" }} />
      </div>

      {/* cursor */}
      <div ref={cursor} className="thread-cursor" aria-hidden="true" />
      <span ref={cursorLabel} className="thread-cursor-label" aria-hidden="true">13.80 BYA</span>
    </>
  )
}
