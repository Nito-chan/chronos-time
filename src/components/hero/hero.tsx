"use client"

import { useEffect, useRef, useCallback, lazy, Suspense } from "react"
import { useHeroStore } from "./hero-store"
import { HeroText } from "./hero-text"
import { HeroCTA } from "./hero-cta"
import { HeroScrollIndicator } from "./hero-scroll-indicator"

const HeroScene = lazy(() =>
  import("./hero-scene").then((m) => ({ default: m.HeroScene }))
)

function useMediaQuery(query: string): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia(query).matches
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const setMouse = useHeroStore((s) => s.setMouse)
  const setScrollProgress = useHeroStore((s) => s.setScrollProgress)
  const setIsReady = useHeroStore((s) => s.setIsReady)
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setMouse(x, y)
    },
    [setMouse]
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [setIsReady])

  useEffect(() => {
    const handleScroll = () => {
      const spacer = spacerRef.current
      if (!spacer) return
      const rect = spacer.getBoundingClientRect()
      const totalHeight = spacer.offsetHeight
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / (totalHeight - window.innerHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setScrollProgress])

  return (
    <>
      <div
        ref={spacerRef}
        className="relative"
        style={{ height: "150vh" }}
      >
        <section
          ref={containerRef}
          className="sticky top-0 flex h-screen w-screen items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#0A0A0A" }}
        >
          {!reducedMotion && (
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          )}

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
            <div className="pointer-events-auto">
              <HeroText />
            </div>
            <div className="pointer-events-auto">
              <HeroCTA />
            </div>
          </div>

          <HeroScrollIndicator />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
            }}
          />
        </section>
      </div>
    </>
  )
}
