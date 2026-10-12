"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CHAPTERS } from "../story"
import { formatEraDate } from "../time"

const INK = "#0E1220"
const ACCENT = "#3347FF"
const MAX_LOG = Math.log10(13_800_000_000)
const toYbp = (l: number) => Math.pow(10, l)

/* ---------------- shared event dots ---------------- */
const EVENTS = [
  { ybp: 13_800_000_000, label: "First light" },
  { ybp: 4_540_000_000, label: "Earth forms" },
  { ybp: 5025, label: "Writing" },
  { ybp: 4560, label: "Pyramids" },
  { ybp: 586, label: "Printing press" },
  { ybp: 257, label: "Steam engine" },
  { ybp: 182, label: "Telegraph" },
  { ybp: 57, label: "ARPANET" },
  { ybp: 36, label: "World Wide Web" },
  { ybp: 19, label: "Every pocket, a clock" },
]

function viewLabel(lo: number, hi: number) {
  return `${formatEraDate(toYbp(hi))} — ${formatEraDate(toYbp(lo))}`
}

/* ---------------- OBSERVE ---------------- */
function Observe() {
  const [center, setCenter] = useState(MAX_LOG - 3.2)
  const [span, setSpan] = useState(6.4)
  const drag = useRef<{ x: number; c: number } | null>(null)
  const box = useRef<HTMLDivElement>(null)

  const lo = Math.max(0, center - span / 2)
  const hi = Math.min(MAX_LOG, center + span / 2)
  const X = useCallback((ybp: number) => ((Math.log10(Math.max(1, ybp)) - lo) / Math.max(1e-6, hi - lo)) * 1000, [lo, hi])

  const zoom = (f: number) => {
    setSpan((s) => Math.min(MAX_LOG, Math.max(0.6, s * f)))
  }
  const pan = (d: number) => {
    setCenter((c) => Math.min(MAX_LOG - span / 2, Math.max(span / 2, c + d * span * 0.2)))
  }

  // ticks: decades inside view
  const ticks: number[] = []
  for (let k = Math.ceil(lo); k <= Math.floor(hi); k++) ticks.push(k)

  return (
    <div className="border-t border-b rule-1px py-8" style={{ borderColor: "rgba(14,18,32,0.16)" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl">Observe</h3>
        <p className="t-label opacity-70">DRAG TO PAN · SCROLL TO ZOOM · ← → PAN · + − ZOOM</p>
      </div>
      <p className="mt-2 text-[15px] opacity-75">Every era and event from one vantage point.</p>

      <div
        ref={box}
        role="slider"
        tabIndex={0}
        aria-label="Timeline ruler. Drag or use arrow keys to pan, plus and minus to zoom."
        aria-valuetext={viewLabel(lo, hi)}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={Math.round(((MAX_LOG - span) / MAX_LOG) * 10)}
        className="mt-6 cursor-ew-resize touch-none select-none"
        style={{ outlineOffset: 4 }}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId)
          drag.current = { x: e.clientX, c: center }
        }}
        onPointerMove={(e) => {
          if (!drag.current || !box.current) return
          const w = box.current.clientWidth
          const dlog = ((drag.current.x - e.clientX) / w) * span
          setCenter(Math.min(MAX_LOG - span / 2, Math.max(span / 2, drag.current.c + dlog)))
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onWheel={(e) => {
          e.preventDefault()
          zoom(e.deltaY > 0 ? 1.12 : 1 / 1.12)
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") pan(-1)
          else if (e.key === "ArrowRight") pan(1)
          else if (e.key === "+" || e.key === "=") zoom(1 / 1.25)
          else if (e.key === "-" || e.key === "_") zoom(1.25)
          else return
          e.preventDefault()
        }}
      >
        <svg viewBox="0 0 1000 150" className="w-full" role="presentation">
          <line x1="0" y1="96" x2="1000" y2="96" stroke={INK} strokeWidth="1.5" opacity="0.85" />
          {ticks.map((k) => {
            const x = ((k - lo) / Math.max(1e-6, hi - lo)) * 1000
            if (x < -20 || x > 1020) return null
            const major = span > 3 ? k % 1 === 0 && (k % 2 === 0 || span < 6) : true
            return (
              <g key={k}>
                <line x1={x} y1="96" x2={x} y2={major ? 78 : 86} stroke={INK} strokeWidth="1" opacity={major ? 0.8 : 0.35} />
                {major && (
                  <text x={x} y="64" textAnchor="middle" fontSize="19" fill={INK} opacity="0.85" fontFamily="var(--font-mono)">
                    {formatEraDate(toYbp(k))}
                  </text>
                )}
              </g>
            )
          })}
          {EVENTS.map((ev) => {
            const l = Math.log10(Math.max(1, ev.ybp))
            if (l < lo || l > hi) return null
            const x = X(ev.ybp)
            return (
              <g key={ev.label} tabIndex={0} role="img" aria-label={`${ev.label}, ${formatEraDate(ev.ybp)}`}>
                <circle cx={x} cy="96" r="6" fill={ACCENT} />
                <circle cx={x} cy="96" r="11" fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.4" />
                <text x={x} y="122" textAnchor="middle" fontSize="17" fill={INK} opacity="0.75" fontFamily="var(--font-mono)">
                  {ev.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button className="btn-thread t-label border px-4 py-2" style={{ borderColor: "rgba(14,18,32,0.3)" }} onClick={() => pan(-1)}>← Back</button>
        <button className="btn-thread t-label border px-4 py-2" style={{ borderColor: "rgba(14,18,32,0.3)" }} onClick={() => pan(1)}>Forward →</button>
        <button className="btn-thread t-label border px-4 py-2" style={{ borderColor: "rgba(14,18,32,0.3)" }} onClick={() => zoom(1 / 1.4)}>+ Zoom in</button>
        <button className="btn-thread t-label border px-4 py-2" style={{ borderColor: "rgba(14,18,32,0.3)" }} onClick={() => zoom(1.4)}>− Zoom out</button>
        <span className="t-label ml-auto tabular-nums opacity-70" aria-live="polite">{viewLabel(lo, hi)}</span>
      </div>
    </div>
  )
}

/* ---------------- SIMULATE ---------------- */
function Simulate() {
  const [split, setSplit] = useState(false)
  return (
    <div className="border-b rule-1px py-8" style={{ borderColor: "rgba(14,18,32,0.16)" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl">Simulate</h3>
        <p className="t-label opacity-70">CLICK THE DECISION POINT · KEYBOARD: TAB + ENTER</p>
      </div>
      <p className="mt-2 text-[15px] opacity-75">Branch a decision and follow the strands.</p>

      <button
        className="mt-6 block w-full text-left"
        aria-expanded={split}
        aria-label={split ? "Merge the strands" : "Split the timeline at the decision point"}
        onClick={() => setSplit((s) => !s)}
      >
        <svg viewBox="0 0 1000 220" className="w-full" role="presentation">
          {!split ? (
            <>
              <line x1="40" y1="110" x2="960" y2="110" stroke={INK} strokeWidth="2" />
              <circle cx="500" cy="110" r="10" fill="none" stroke={ACCENT} strokeWidth="3" />
              <circle cx="500" cy="110" r="3.5" fill={ACCENT} />
              <text x="500" y="150" textAnchor="middle" fontSize="18" fill={INK} opacity="0.7" fontFamily="var(--font-mono)">
                1945 · DECISION POINT — CLICK TO SPLIT
              </text>
            </>
          ) : (
            <>
              <line x1="40" y1="110" x2="380" y2="110" stroke={INK} strokeWidth="2" />
              <path d="M380 110 C 520 110, 520 52, 660 52 L 960 52" fill="none" stroke={ACCENT} strokeWidth="2.5" />
              <path d="M380 110 C 520 110, 520 168, 660 168 L 960 168" fill="none" stroke="#C9893B" strokeWidth="2.5" />
              <circle cx="380" cy="110" r="10" fill="none" stroke={ACCENT} strokeWidth="3" />
              <text x="810" y="36" textAnchor="middle" fontSize="18" fill={INK} fontFamily="var(--font-mono)">STRAND A · OPEN EXCHANGE</text>
              <text x="810" y="196" textAnchor="middle" fontSize="18" fill={INK} fontFamily="var(--font-mono)">STRAND B · CLOSED BORDERS</text>
            </>
          )}
        </svg>
      </button>
      <div className="mt-3 grid gap-3 md:grid-cols-2" aria-live="polite">
        {split ? (
          <>
            <p className="border-l-2 pl-4 text-[15px] opacity-80" style={{ borderColor: ACCENT }}>
              Strand A — ideas and instruments travel freely; the timeline accelerates.
            </p>
            <p className="border-l-2 pl-4 text-[15px] opacity-80" style={{ borderColor: "#C9893B" }}>
              Strand B — knowledge stays local; the same century unfolds slower.
            </p>
          </>
        ) : (
          <p className="text-[15px] opacity-60">One line, so far. Every branch stays comparable, millisecond for millisecond.</p>
        )}
      </div>
    </div>
  )
}

/* ---------------- NAVIGATE ---------------- */
const STOPS = [
  { id: "stars", label: "First stars", ybp: 13_600_000_000 },
  { id: "stone", label: "First mark in stone", ybp: 5025 },
  { id: "press", label: "Printing press", ybp: 586 },
  { id: "web", label: "World Wide Web", ybp: 36 },
  { id: "here", label: "You", ybp: 0 },
]

function Navigate() {
  const [visited, setVisited] = useState<string[]>([])
  const [active, setActive] = useState(0)
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])
  const idRef = useRef(0)
  const box = useRef<HTMLDivElement>(null)

  const leaveTrail = (clientX: number, clientY: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    const id = ++idRef.current
    const pt = { x: clientX - r.left, y: clientY - r.top, id }
    setTrail((t) => [...t.slice(-36), pt])
    window.setTimeout(() => setTrail((t) => t.filter((p) => p.id !== id)), 900)
  }

  const visit = (i: number) => {
    setActive(i)
    setVisited((v) => (v.includes(STOPS[i]!.id) ? v : [...v, STOPS[i]!.id]))
  }

  const suggestion = STOPS.findIndex((s) => !visited.includes(s.id))

  return (
    <div className="border-b rule-1px py-8" style={{ borderColor: "rgba(14,18,32,0.16)" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl">Navigate</h3>
        <p className="t-label opacity-70">MOVE ACROSS THE RULER · ARROWS + ENTER</p>
      </div>
      <p className="mt-2 text-[15px] opacity-75">A temporal API and an interface that learns how you explore.</p>

      <div
        ref={box}
        className="relative mt-6"
        onPointerMove={(e) => leaveTrail(e.clientX, e.clientY)}
      >
        {trail.map((p) => (
          <span key={p.id} className="pointer-events-none absolute size-1.5 rounded-full"
            style={{ left: p.x, top: p.y, background: ACCENT, opacity: 0.5, transition: "opacity 0.9s" }} />
        ))}
        <div role="listbox" aria-label="Suggested stops" className="flex items-center gap-2 overflow-x-auto py-2"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") visit(Math.min(STOPS.length - 1, active + 1))
            else if (e.key === "ArrowLeft") visit(Math.max(0, active - 1))
            else if (e.key === "Enter") visit(active)
            else return
            e.preventDefault()
          }}
        >
          <span className="h-px flex-1" style={{ background: "rgba(14,18,32,0.35)" }} aria-hidden="true" />
          {STOPS.map((s, i) => {
            const isActive = i === active
            const isSuggested = i === suggestion
            const isVisited = visited.includes(s.id)
            return (
              <button
                key={s.id}
                role="option"
                aria-selected={isActive}
                onClick={() => visit(i)}
                onFocus={() => setActive(i)}
                className="btn-thread flex shrink-0 flex-col items-center gap-2 border px-5 py-3"
                style={{
                  borderColor: isSuggested ? ACCENT : "rgba(14,18,32,0.25)",
                  background: isActive ? "rgba(51,71,255,0.08)" : "transparent",
                }}
              >
                <span className="t-label" style={{ color: isSuggested || isActive ? ACCENT : INK }}>
                  {isVisited ? "✓ " : ""}{s.label}
                </span>
                <span className="t-label opacity-60">{formatEraDate(s.ybp)}</span>
                {isSuggested && <span className="t-label" style={{ color: ACCENT }}>← SUGGESTED NEXT</span>}
              </button>
            )
          })}
          <span className="h-px flex-1" style={{ background: "rgba(14,18,32,0.35)" }} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

/* ---------------- STATS ---------------- */
function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e!.isIntersecting) return
      const t0 = performance.now()
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1400)
        setT(1 - Math.pow(1 - k, 3))
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
      io.disconnect()
    }, { threshold: 0.4 })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  const stats = [
    { v: `${(1.2 * t).toFixed(1)}M`, l: "events indexed" },
    { v: `${Math.round(42 * t)}`, l: "civilizations tracked" },
    { v: `${(99.97 * t).toFixed(2)}%`, l: "temporal accuracy" },
  ]
  return (
    <div ref={ref} className="pt-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.l} className="border-l pl-5" style={{ borderColor: "rgba(14,18,32,0.25)" }}>
            <p className="font-display text-4xl tabular-nums">{s.v}</p>
            <p className="t-label mt-1 opacity-70">{s.l}</p>
          </div>
        ))}
      </div>
      <p className="t-label mt-6 opacity-50">SAMPLE DATA — TO BE CONFIRMED BEFORE LAUNCH</p>
    </div>
  )
}

/* ---------------- SECTION ---------------- */
export function Instrument() {
  const def = CHAPTERS[5]!
  return (
    <section id="chronos-instrument" data-chapter={5} aria-label="VI · The Instrument" className="relative" style={{ minHeight: `${def.vh * 100}vh` }}>
      <div className="mx-auto max-w-6xl px-6 py-[12vh] md:px-10">
        <p className="t-label" style={{ color: ACCENT }}>{def.numeral} · {def.label.toUpperCase()}</p>
        <h2 className="t-display font-display mt-6">The story becomes <em className="italic">a tool.</em></h2>
        <p className="t-body mt-8" style={{ color: "var(--pg-ink2)" }}>{def.body}</p>

        <div className="mt-14">
          <Observe />
          <Simulate />
          <Navigate />
          <Stats />
        </div>
      </div>
    </section>
  )
}
