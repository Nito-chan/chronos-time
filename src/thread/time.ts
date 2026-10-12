"use client"

import { CHAPTERS, THRESHOLD_VH, TOTAL_VH } from "./story"

/**
 * Logarithmic story clock. Scroll position (0..1 across the whole page)
 * maps to years-before-present. Early chapters move slowly through deep
 * time; later chapters accelerate. Pure function — scrolling back rewinds.
 *
 * Stops are years before present at each chapter boundary
 * (threshold start → end of present). Negative = projected future.
 */
const STOPS_YBP = [
  13_800_000_000, // threshold start
  13_800_000_000, // end threshold / start I (still the beginning)
  5_025, // end I / start II (3000 BCE ≈ 5025 ybp)
  266, // end II / start III (1760)
  36, // end III / start IV (1990)
  -16, // end IV / start V (2042 projected)
  0, // end V / start VI (now)
  0, // end VI / VII
  0, // end of page
]

const C = 4 // shift so log stays finite through 0 and slightly negative
const logT = (ybp: number) => Math.log10(Math.max(ybp, -15) + 16 + C)

const LOG_STOPS = STOPS_YBP.map(logT)

/** Chapter boundary positions in global 0..1 progress. */
export function chapterBoundaries(): number[] {
  const bounds = [0]
  let acc = THRESHOLD_VH
  bounds.push(acc / TOTAL_VH)
  for (const c of CHAPTERS) {
    acc += c.vh
    bounds.push(acc / TOTAL_VH)
  }
  return bounds
}

const BOUNDS = chapterBoundaries()

/** Global progress → years before present (float). */
export function ybpAtProgress(p: number): number {
  const cl = Math.min(1, Math.max(0, p))
  let i = 0
  while (i < BOUNDS.length - 2 && cl > BOUNDS[i + 1]!) i++
  const a = BOUNDS[i]!
  const b = BOUNDS[i + 1]!
  const t = b > a ? (cl - a) / (b - a) : 0
  const logVal = LOG_STOPS[i]! + (LOG_STOPS[i + 1]! - LOG_STOPS[i]!) * t
  return Math.pow(10, logVal) - 16 - C
}

const grouped = (n: number) =>
  Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")

/** HUD readout, e.g. "T−13,800,000,000 YRS". At present: "T−0 · NOW". */
export function formatCounter(ybp: number): string {
  if (ybp <= 0.5) return "T−0 · NOW"
  if (ybp >= 1_000_000_000) {
    const b = ybp / 1_000_000_000
    const whole = Math.floor(b)
    const frac = Math.floor((b - whole) * 100)
    return `T−${grouped(whole * 1_000_000_000 + frac * 10_000_000)} YRS`
  }
  if (ybp >= 1_000_000) {
    return `T−${grouped(Math.floor(ybp / 10_000) * 10_000)} YRS`
  }
  if (ybp >= 10_000) {
    return `T−${grouped(Math.floor(ybp / 100) * 100)} YRS`
  }
  if (ybp >= 500) {
    const ce = Math.ceil(2026 - ybp)
    return ce <= 0 ? `T−${Math.floor(ybp)} YRS` : `T−${Math.floor(ybp)} YRS · ${ce} CE`
  }
  const year = Math.round(2026 - ybp)
  return `T−${Math.max(0, Math.floor(ybp))} YRS · ${year}`
}

/** Short era date for the cursor label. */
export function formatEraDate(ybp: number): string {
  if (ybp <= 0.5) return "NOW"
  if (ybp >= 1_000_000_000) return `${(ybp / 1_000_000_000).toFixed(2)} BYA`
  if (ybp >= 1_000_000) return `${(ybp / 1_000_000).toFixed(1)} MYA`
  if (ybp >= 5025 - 60 && ybp <= 5025 + 60) return "3000 BCE"
  if (ybp >= 10_000) return `${grouped(ybp)} YBP`
  const year = Math.round(2026 - ybp)
  return year <= 0 ? `${Math.abs(year - 1)} BCE` : `${year} CE`
}
