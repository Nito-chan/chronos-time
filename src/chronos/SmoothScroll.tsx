"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { useChronosStore } from "./store"

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    useChronosStore.getState().setReducedMotion(reduced)
    if (reduced) {
      useChronosStore.getState().setReady(true)
      return
    }
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const t = setTimeout(() => useChronosStore.getState().setReady(true), 300)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      useChronosStore.getState().setMouse(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      )
    }
    window.addEventListener("mousemove", onMouse, { passive: true })
    return () => window.removeEventListener("mousemove", onMouse)
  }, [])

  return null
}
