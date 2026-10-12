"use client"

import { CHAPTERS, THRESHOLD_VH, TOTAL_VH, type ChapterGrade } from "./story"

export const THRESHOLD_GRADE: ChapterGrade = {
  bg: "#03040A",
  ink: "#E9ECF8",
  ink2: "#9AA3C7",
  accent: "#8FA8FF",
  grain: 0.7,
  vignette: true,
}

const PEARL: ChapterGrade = {
  bg: "#ECEFF3",
  ink: "#0E1220",
  ink2: "#4A5266",
  accent: "#3347FF",
  grain: 0.05,
  vignette: false,
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, "0")
  return `#${c(r)}${c(g)}${c(b)}`
}

export function mixHex(a: string, b: string, t: number): string {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  return rgbToHex(
    ca[0] + (cb[0] - ca[0]) * t,
    ca[1] + (cb[1] - ca[1]) * t,
    ca[2] + (cb[2] - ca[2]) * t
  )
}

const smooth = (t: number) => t * t * (3 - 2 * t)

export interface PageGrade extends ChapterGrade {
  /** 0 = dark world, 1 = fully light. Ink switches discretely at 0.5. */
  lightT: number
}

/** Segment boundaries (threshold + chapters) in global 0..1. */
function segments(): { start: number; end: number }[] {
  const segs: { start: number; end: number }[] = []
  let acc = 0
  const push = (vh: number) => {
    const s = acc / TOTAL_VH
    acc += vh
    segs.push({ start: s, end: acc / TOTAL_VH })
  }
  push(THRESHOLD_VH)
  for (const c of CHAPTERS) push(c.vh)
  return segs
}

const SEGS = segments()
const GRADES: ChapterGrade[] = [
  THRESHOLD_GRADE,
  ...CHAPTERS.slice(0, 5).map((c) => c.grade),
  PEARL, // VI
  PEARL, // VII
]

/**
 * Blended page grade at global progress. Colors crossfade across the last
 * 20% of each segment; Synthesis (index 5) additionally lifts dark→light
 * across its own midpoint, completing at its end.
 */
export function gradeAtProgress(p: number): PageGrade {
  const cl = Math.min(1, Math.max(0, p))
  let i = 0
  while (i < SEGS.length - 1 && cl > SEGS[i]!.end) i++
  const seg = SEGS[i]!
  const span = Math.max(1e-6, seg.end - seg.start)
  const local = (cl - seg.start) / span

  const cur = GRADES[i]!
  const prev = i > 0 ? GRADES[i - 1]! : cur
  // crossfade from previous grade across first 20% of this segment
  // (== last 20% of previous chapter's scroll, visually continuous)
  const blend = smooth(Math.min(1, Math.max(0, local / 0.2)))

  let bg = mixHex(prev.bg, cur.bg, blend)
  let lightT = i >= 7 ? 1 : 0

  if (i === 5) {
    // Synthesis: dark → pearl across the chapter, ink switches at midpoint
    const lift = smooth(Math.min(1, Math.max(0, (local - 0.35) / 0.55)))
    bg = mixHex(bg, PEARL.bg, lift)
    lightT = lift
  }
  if (i === 6 || i === 7) lightT = 1

  const inkSet = lightT >= 0.5 ? PEARL : cur
  const inkPrev = lightT >= 0.5 ? PEARL : prev
  const ink = lightT >= 0.5 ? PEARL.ink : mixHex(inkPrev.ink, inkSet.ink, blend)
  const ink2 =
    lightT >= 0.5 ? PEARL.ink2 : mixHex(inkPrev.ink2, inkSet.ink2, blend)
  const accent =
    lightT >= 0.5 && i >= 6
      ? PEARL.accent
      : mixHex(prev.accent, cur.accent, blend)

  const grain = prev.grain + (cur.grain - prev.grain) * blend

  return {
    bg,
    ink,
    ink2,
    accent,
    accent2: cur.accent2,
    grain,
    vignette: lightT < 0.5 && (blend < 0.5 ? prev.vignette : cur.vignette),
    lightT,
  }
}

/** Chapter index at progress: -1 threshold, 0..6 chapters. */
export function chapterAtProgress(p: number): number {
  const cl = Math.min(1, Math.max(0, p))
  for (let i = SEGS.length - 1; i >= 0; i--) {
    if (cl >= SEGS[i]!.start) return i - 1
  }
  return -1
}
