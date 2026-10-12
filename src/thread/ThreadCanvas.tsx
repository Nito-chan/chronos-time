"use client"

import { useEffect, useRef } from "react"
import { scrollSnapshot, useThreadStore } from "./store"
import { gradeAtProgress } from "./grades"
import { chapterBoundaries } from "./time"

/**
 * The Thread — one fixed canvas behind the page.
 * Procedurally drawn line + chapter scenes, all scrubbed by scroll.
 * Deterministic in scroll (rewind-safe); time animates only when
 * motion is allowed and not paused.
 */

const rand = (i: number, s: number) => {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453
  return x - Math.floor(x)
}

export function ThreadCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    useThreadStore.getState().setReducedMotion(reduced)

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let time = 0
    let lastT = performance.now()
    let quality = 1

    const resize = () => {
      const mobile = window.innerWidth < 768
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      w = window.innerWidth
      h = window.innerHeight
      quality = mobile ? 0.45 : 1
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const bounds = chapterBoundaries() // 9 entries: start..end
    const segLocal = (p: number, seg: number) => {
      const a = bounds[seg]!
      const b = bounds[seg + 1]!
      return Math.min(1, Math.max(0, (p - a) / Math.max(1e-6, b - a)))
    }
    // envelope: 1 while its segment is active, fading across neighbours
    const segWeight = (p: number, seg: number) => {
      const a = bounds[seg]!
      const b = bounds[seg + 1]!
      if (p < a || p > b) {
        // fade across 15% of neighbour span
        const span = b - a
        if (p < a && p > a - span * 0.4) return 1 - (a - p) / (span * 0.4)
        if (p > b && p < b + span * 0.4) return 1 - (p - b) / (span * 0.4)
        return 0
      }
      const local = (p - a) / Math.max(1e-6, b - a)
      const edge = Math.min(1, local / 0.12, (1 - local) / 0.12)
      return Math.max(0.25, edge)
    }

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now
      const st = useThreadStore.getState()
      if (!st.paused && !st.reducedMotion) time += dt
      const p = scrollSnapshot.displayProgress
      const vel = Math.min(60, Math.abs(scrollSnapshot.velocity))
      const grade = gradeAtProgress(p)
      const cx = w * 0.5

      // bg
      ctx.globalAlpha = 1
      ctx.fillStyle = grade.bg
      ctx.fillRect(0, 0, w, h)

      const glow = (color: string, width: number, alpha: number) => {
        ctx.strokeStyle = color
        ctx.globalAlpha = alpha
        ctx.lineWidth = width
        ctx.lineCap = "round"
      }

      /* ---------- FAR 0.2x ---------- */
      // stars (threshold + genesis)
      const starW = Math.max(segWeight(p, 0), segWeight(p, 1))
      if (starW > 0.01) {
        const n = Math.floor(140 * quality)
        const drift = (scrollSnapshot.y * 0.2) % (h * 2)
        for (let i = 0; i < n; i++) {
          const sx = rand(i, 11) * w
          let sy = rand(i, 12) * h * 2 - drift
          sy = ((sy % (h * 2)) + h * 2) % (h * 2) - h / 2
          const tw = 0.25 + 0.75 * Math.abs(Math.sin(time * (0.3 + rand(i, 13)) + i))
          ctx.globalAlpha = starW * tw * (0.2 + rand(i, 14) * 0.5)
          ctx.fillStyle = i % 9 === 0 ? grade.accent : "#FFFFFF"
          const s = rand(i, 15) > 0.92 ? 2 : 1
          ctx.fillRect(sx, sy, s, s)
        }
      }
      // strata bands (memory)
      const memW = segWeight(p, 2)
      if (memW > 0.01) {
        const n = 7
        for (let i = 0; i < n; i++) {
          const yBase = h * (0.12 + (i / n) * 0.8)
          const y = yBase - (scrollSnapshot.y * 0.2 * (0.5 + i * 0.08)) % (h * 0.3)
          ctx.globalAlpha = memW * (0.05 + (i % 3) * 0.03)
          ctx.fillStyle = i % 2 ? "#C9893B" : "#2F4B8F"
          ctx.fillRect(0, ((y % h) + h) % h, w, 2 + (i % 4) * 6)
        }
      }
      // faint grid (signal)
      const sigW = segWeight(p, 4)
      if (sigW > 0.01) {
        ctx.globalAlpha = sigW * 0.07
        ctx.strokeStyle = grade.accent
        ctx.lineWidth = 1
        const step = 64
        const ox = (scrollSnapshot.y * 0.2) % step
        ctx.beginPath()
        for (let x = -ox; x < w; x += step) {
          ctx.moveTo(x, 0)
          ctx.lineTo(x, h)
        }
        ctx.stroke()
      }

      /* ---------- MID: THE THREAD ---------- */
      const sway = (y: number, amp: number, f: number) =>
        Math.sin(y * f + time * 0.4) * amp

      // genesis stretch (segment 1): line grows downward with local progress
      const g1 = segLocal(p, 1)
      // memory loop (segment 2)
      const mem = segLocal(p, 2)
      // fracture snap (segment 3)
      const frac = segLocal(p, 3)
      // signal fibers (segment 4)
      const sig = segLocal(p, 4)
      // synthesis lattice (segment 5) — see lattice block below
      void segLocal(p, 5)

      const threadX = (y: number) => cx + sway(y, 14, 0.004)

      // base thread: full-height line, alpha shaped per chapter
      const inLight = grade.lightT >= 0.5
      glow(inLight ? grade.accent : "#F2F4FF", inLight ? 1.5 : 1.6, inLight ? 0.5 : 0.75)
      ctx.beginPath()
      const topY = -h * 0.1
      const botY = h * 1.1
      // threshold: point grows into line with first scroll
      const t0 = segLocal(p, 0)
      const growTop = h * 0.5 - t0 * h * 0.6
      const yStart = p < bounds[1]! ? growTop : topY
      const steps = 60
      for (let s = 0; s <= steps; s++) {
        const y = yStart + ((botY - yStart) * s) / steps
        // fracture gap: line parts around the seam
        let x = threadX(y)
        if (p >= bounds[3]! && p <= bounds[4]!) {
          const gap = Math.sin(frac * Math.PI) * h * 0.16
          const midY = h * (0.5 - frac * 0.1)
          const d = Math.abs(y - midY)
          const push = Math.max(0, 1 - d / (h * 0.3)) * gap
          x += (x >= cx ? 1 : -1) * push + (y > midY ? 26 : -26) * Math.sin(frac * Math.PI)
        }
        if (s === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.globalAlpha = 1

      // threshold point glow
      if (p < (bounds[1]! + bounds[2]!) / 2) {
        const pulse = st.reducedMotion ? 0.7 : 0.55 + 0.3 * Math.sin(time * 1.4)
        const pr = 3 + (1 - t0) * 2
        const g = ctx.createRadialGradient(cx, h * 0.5, 0, cx, h * 0.5, 60)
        g.addColorStop(0, grade.accent)
        g.addColorStop(1, "transparent")
        ctx.globalAlpha = 0.5 * pulse + 0.2
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, h * 0.5, 60, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.fillStyle = "#FFFFFF"
        ctx.beginPath()
        ctx.arc(cx, h * 0.5, pr, 0, Math.PI * 2)
        ctx.fill()
      }

      // genesis crystal assembly around thread
      if (segWeight(p, 1) > 0.01 && g1 > 0.02) {
        const n = Math.floor(26 * quality)
        const cxg = cx
        const cyg = h * 0.42
        for (let i = 0; i < n; i++) {
          const ang = rand(i, 21) * Math.PI * 2 + time * 0.05 * (i % 2 ? 1 : -1)
          const target = 40 + rand(i, 22) * 130
          const r = target * (1 - g1) + 8 * g1 + rand(i, 23) * 6
          const x = cxg + Math.cos(ang) * r
          const y = cyg + Math.sin(ang) * r * 0.8
          ctx.globalAlpha = segWeight(p, 1) * g1 * (0.3 + rand(i, 24) * 0.5)
          ctx.fillStyle = i % 5 === 0 ? grade.accent : "#DCE4FF"
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(ang + time * 0.1)
          const s = 1.5 + rand(i, 25) * 2.5
          ctx.fillRect(-s / 2, -s / 2, s, s)
          ctx.restore()
        }
        ctx.globalAlpha = 1
      }

      // memory: thread wraps once around a stone ring
      if (memW > 0.01 && mem > 0.03) {
        const rx = Math.min(w * 0.3, 220)
        const ry = rx * 0.62
        const ox = w * 0.5
        const oy = h * 0.46
        glow("#C9893B", 5, memW * 0.5)
        ctx.beginPath()
        ctx.ellipse(ox, oy, rx, ry, 0.12, 0, Math.PI * 2)
        ctx.stroke()
        glow(grade.accent, 1.6, memW * Math.min(1, mem * 1.4))
        ctx.beginPath()
        ctx.ellipse(ox, oy, rx, ry, 0.12, -0.4, -0.4 + mem * Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // fracture: spinning brass rings, speed ← scroll velocity
      if (segWeight(p, 3) > 0.01) {
        const w3 = segWeight(p, 3)
        const spin = (time * (0.6 + vel * 0.12)) % (Math.PI * 2)
        const R = Math.min(w, h) * 0.3
        for (let k = 0; k < 3; k++) {
          glow(k === 2 ? "#FFB84D" : "#D4A64A", k === 2 ? 1.5 : 3 - k * 0.7, w3 * (0.65 - k * 0.15))
          ctx.beginPath()
          ctx.ellipse(cx, h * 0.44, R - k * 26, (R - k * 26) * 0.7, 0.2 + k * 0.3, spin * (1 + k * 0.4), spin * (1 + k * 0.4) + Math.PI * (1.5 - k * 0.2))
          ctx.stroke()
        }
        // sparks toward camera
        const n = Math.floor((30 + vel * 2) * quality)
        for (let i = 0; i < n; i++) {
          const life = (time * (0.6 + rand(i, 31) * 1.4) + rand(i, 32)) % 1
          const ang = rand(i, 33) * Math.PI * 2
          const r = life * (R + 60 + vel)
          const x = cx + Math.cos(ang) * r
          const y = h * 0.44 + Math.sin(ang) * r * 0.7 - life * 40
          ctx.globalAlpha = w3 * (1 - life) * 0.9
          ctx.fillStyle = rand(i, 34) > 0.4 ? "#FFB84D" : "#D4A64A"
          const s = 1 + (1 - life) * 2.5
          ctx.fillRect(x, y, s, s * 0.6)
        }
        ctx.globalAlpha = 1
      }

      // signal: fiber bundle fanning + globe
      if (sigW > 0.01 && sig > 0.02) {
        const fibers = Math.floor(26 * quality)
        const lit = Math.floor(sig * fibers)
        for (let i = 0; i < fibers; i++) {
          const spread = ((i / fibers) - 0.5) * w * 0.5
          const on = i < lit
          glow(grade.accent, on ? 1.4 : 1, sigW * (on ? 0.75 : 0.18))
          ctx.beginPath()
          ctx.moveTo(cx + sway(0, 10, 0.004), -20)
          ctx.bezierCurveTo(
            cx + spread * 0.3, h * 0.3,
            cx + spread, h * 0.6,
            cx + spread * 1.15 + sway(h, 12, 0.005), h + 20
          )
          ctx.stroke()
        }
        // dark globe
        ctx.globalAlpha = sigW * 0.85
        ctx.fillStyle = "#04090D"
        ctx.beginPath()
        ctx.arc(w * 0.72, h * 0.4, Math.min(w, h) * 0.16, 0, Math.PI * 2)
        ctx.fill()
        glow(grade.accent, 1.2, sigW * 0.6)
        ctx.beginPath()
        ctx.arc(w * 0.72, h * 0.4, Math.min(w, h) * 0.16, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // synthesis lattice: breathing neural mesh
      if (segWeight(p, 5) > 0.01) {
        const w5 = segWeight(p, 5)
        const breath = st.reducedMotion ? 1 : 1 + Math.sin(time * ((Math.PI * 2) / 6)) * 0.035
        const cols = 9
        const rows = 7
        const gw = Math.min(w * 0.7, 560) * breath
        const gh = gw * 0.62
        const ox = cx - gw / 2
        const oy = h * 0.4 - gh / 2
        const node = (c: number, r: number): [number, number] => {
          const nx = ox + (gw * c) / (cols - 1) + Math.sin(time * 0.5 + c * 1.3 + r) * 5
          const ny = oy + (gh * r) / (rows - 1) + Math.cos(time * 0.4 + r * 1.7 + c) * 5
          return [nx, ny]
        }
        ctx.lineWidth = 1
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const [x1, y1] = node(c, r)
            if (c < cols - 1) {
              const [x2, y2] = node(c + 1, r)
              ctx.globalAlpha = w5 * (inLight ? 0.3 : 0.4)
              ctx.strokeStyle = inLight ? grade.accent : "#B9A7F2"
              ctx.beginPath()
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.stroke()
            }
            if (r < rows - 1) {
              const [x2, y2] = node(c, r + 1)
              ctx.globalAlpha = w5 * (inLight ? 0.22 : 0.3)
              ctx.strokeStyle = inLight ? grade.accent : "#3EE0D0"
              ctx.beginPath()
              ctx.moveTo(x1, y1)
              ctx.lineTo(x2, y2)
              ctx.stroke()
            }
          }
        }
        for (let c = 0; c < cols; c += 2) {
          for (let r = 0; r < rows; r += 2) {
            const [x, y] = node(c, r)
            ctx.globalAlpha = w5 * 0.9
            ctx.fillStyle = inLight ? grade.accent : "#EDEBFF"
            ctx.beginPath()
            ctx.arc(x, y, inLight ? 1.6 : 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        // calm core orb
        const coreR = (inLight ? 26 : 34) * breath
        const cg = ctx.createRadialGradient(cx, h * 0.4, 0, cx, h * 0.4, coreR * 3)
        cg.addColorStop(0, inLight ? grade.accent : "#EFE9FF")
        cg.addColorStop(1, "transparent")
        ctx.globalAlpha = w5 * (inLight ? 0.35 : 0.5)
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(cx, h * 0.4, coreR * 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      /* ---------- NEAR 1.4x, slightly blurred ---------- */
      const nearOn =
        Math.max(segWeight(p, 1), segWeight(p, 2), segWeight(p, 3), segWeight(p, 4)) > 0.02
      if (nearOn && !inLight) {
        const n = Math.floor(46 * quality)
        const drift = scrollSnapshot.y * 1.4
        ctx.fillStyle = "#FFFFFF"
        for (let i = 0; i < n; i++) {
          const speed = 0.3 + rand(i, 41) * 0.9
          let y = rand(i, 42) * h * 2 - ((drift * speed) % (h * 2))
          y = ((y % (h * 2)) + h * 2) % (h * 2) - h / 2
          const x = rand(i, 43) * w + Math.sin(time * 0.6 + i) * 18
          const inFrac = p >= bounds[3]! && p <= bounds[4]!
          ctx.globalAlpha = 0.05 + rand(i, 44) * (inFrac ? 0.3 : 0.12)
          ctx.fillStyle = inFrac && rand(i, 45) > 0.6 ? "#FFB84D" : "#FFFFFF"
          const s = 1 + rand(i, 46) * 2.2
          ctx.fillRect(x, y, s, s)
        }
        ctx.globalAlpha = 1
      }

      // data rain (signal near-layer)
      if (sigW > 0.02 && sig > 0.05) {
        const n = Math.floor(60 * quality)
        for (let i = 0; i < n; i++) {
          const speed = 120 + rand(i, 51) * 260
          const y = ((rand(i, 52) * h + time * speed) % (h + 40)) - 20
          const x = rand(i, 53) * w
          ctx.globalAlpha = sigW * (0.1 + rand(i, 54) * 0.35)
          ctx.fillStyle = grade.accent
          ctx.fillRect(x, y, 1, 6 + rand(i, 55) * 14)
        }
        ctx.globalAlpha = 1
      }
    }

    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
