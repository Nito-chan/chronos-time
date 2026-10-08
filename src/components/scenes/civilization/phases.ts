export interface PhaseWindow {
  start: number
  end: number
}

export const PHASES = {
  ARRIVAL: { start: 0, end: 0.1 },
  OBSERVATORY: { start: 0.1, end: 0.25 },
  ARCHITECTURE: { start: 0.25, end: 0.4 },
  ENERGY: { start: 0.4, end: 0.55 },
  CHAMBER: { start: 0.55, end: 0.8 },
  REVELATION: { start: 0.8, end: 1.0 },
} as const

export type PhaseKey = keyof typeof PHASES

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export function phaseValue(phase: number, window: PhaseWindow): number {
  return smoothstep(window.start, window.end, Math.min(phase, window.end))
}

export function phaseRange(
  phase: number,
  window: PhaseWindow
): number {
  const t = (phase - window.start) / (window.end - window.start)
  return Math.max(0, Math.min(1, t))
}
