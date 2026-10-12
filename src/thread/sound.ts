"use client"

/**
 * Opt-in ambient sound. Lazily created on first enable (never autoplay).
 * Low bed per chapter + soft tick while Fracture is active.
 */

let ctx: AudioContext | null = null
let bedOsc: OscillatorNode[] = []
let bedGain: GainNode | null = null
let tickTimer: number | null = null
let currentChapter = -2

function ensure(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === "suspended") void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

// base frequency per chapter index (-1 threshold, 0..4 story, 5+ light)
const BED_FREQ = [55, 48, 65, 110, 220, 174, 174, 174]

function startBed(chapter: number) {
  const ac = ensure()
  if (!ac) return
  stopBed()
  const freq = BED_FREQ[Math.min(Math.max(chapter + 1, 0), BED_FREQ.length - 1)]!
  bedGain = ac.createGain()
  bedGain.gain.value = 0
  bedGain.connect(ac.destination)
  bedOsc = [0, 4, 7].map((semi) => {
    const o = ac.createOscillator()
    o.type = "sine"
    o.frequency.value = freq * Math.pow(2, semi / 12)
    o.detune.value = (Math.random() - 0.5) * 8
    o.connect(bedGain!)
    o.start()
    return o
  })
  bedGain.gain.linearRampToValueAtTime(0.035, ac.currentTime + 2)
}

function stopBed() {
  try {
    bedOsc.forEach((o) => {
      try {
        o.stop()
      } catch {
        /* noop */
      }
      o.disconnect()
    })
  } catch {
    /* noop */
  }
  bedOsc = []
  if (bedGain) {
    try {
      bedGain.disconnect()
    } catch {
      /* noop */
    }
    bedGain = null
  }
}

function tick() {
  const ac = ensure()
  if (!ac) return
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.type = "square"
  o.frequency.value = 1900
  g.gain.value = 0.015
  o.connect(g)
  g.connect(ac.destination)
  o.start()
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.03)
  o.stop(ac.currentTime + 0.04)
}

export function soundChapter(chapter: number, enabled: boolean) {
  if (!enabled) return
  if (chapter === currentChapter) return
  currentChapter = chapter
  startBed(chapter)
  if (tickTimer) {
    window.clearInterval(tickTimer)
    tickTimer = null
  }
  if (chapter === 2) {
    tickTimer = window.setInterval(tick, 500)
  }
}

export function soundOff() {
  currentChapter = -2
  if (tickTimer) {
    window.clearInterval(tickTimer)
    tickTimer = null
  }
  stopBed()
  if (ctx) {
    void ctx.suspend().catch(() => {})
  }
}
