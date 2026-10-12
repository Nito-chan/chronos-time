"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { scrollSnapshot, useThreadStore } from "./store"
import { gradeAtProgress, chapterAtProgress } from "./grades"
import { chapterBoundaries } from "./time"

const BOUNDS = chapterBoundaries()

/**
 * Smooth scroll (light inertia, never hijacked) + the single scroll
 * snapshot every scrubbed effect reads. Also paints the live page grade
 * onto :root vars and publishes chapter to the store.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) useThreadStore.getState().setReducedMotion(true)

    let lenis: Lenis | null = null
    if (!reduced) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
      })
      let raf = 0
      const loop = (time: number) => {
        lenis!.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis
      const cleanup = () => {
        cancelAnimationFrame(raf)
        lenis!.destroy()
      }
      void cleanup
    }

    let ticking = 0
    let lastY = window.scrollY
    const update = () => {
      ticking = 0
      const y = window.scrollY
      const vh = window.innerHeight
      const doc = Math.max(1, document.documentElement.scrollHeight - vh)
      const p = Math.min(1, Math.max(0, y / doc))
      scrollSnapshot.y = y
      scrollSnapshot.vh = vh
      scrollSnapshot.doc = doc
      scrollSnapshot.progress = p
      scrollSnapshot.velocity += (y - lastY - scrollSnapshot.velocity) * 0.2
      lastY = y

      const chapter = chapterAtProgress(p)
      // Reduced motion: freeze the scene per chapter (still image + fade),
      // no scrubbed morphing or color crossfades while scrolling.
      const st = useThreadStore.getState()
      let pf = p
      if (st.reducedMotion) {
        const seg = Math.min(BOUNDS.length - 2, Math.max(0, chapter + 1))
        pf = (BOUNDS[seg]! + BOUNDS[seg + 1]!) / 2
      }
      scrollSnapshot.displayProgress = pf
      st.setProgress(pf, chapter)

      const g = gradeAtProgress(pf)
      const root = document.documentElement
      root.style.setProperty("--pg-bg", g.bg)
      root.style.setProperty("--pg-ink", g.ink)
      root.style.setProperty("--pg-ink2", g.ink2)
      root.style.setProperty("--pg-accent", g.accent)
      root.style.setProperty("--pg-grain", String(g.grain))
      root.style.setProperty("--pg-vignette", g.vignette ? "1" : "0")
      document.body.classList.toggle("light-world", g.lightT >= 0.5)
    }
    const onScroll = () => {
      if (!ticking) ticking = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    const ready = window.setTimeout(() => useThreadStore.getState().setReady(true), 250)

    return () => {
      window.clearTimeout(ready)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (ticking) cancelAnimationFrame(ticking)
      lenis?.destroy()
      ;(window as unknown as { __lenis?: Lenis }).__lenis = undefined
    }
  }, [])

  return null
}

/** Eased jump used by the time rail. */
export function jumpToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 })
  else el.scrollIntoView({ behavior: "smooth" })
}
