"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { CivilizationLabels } from "./civilization-labels"

const CIVILIZATION_HEIGHT = 500

const CivilizationCanvas = dynamic(
  () =>
    import("./civilization-scene").then((m) => ({
      default: m.CivilizationCanvas,
    })),
  { ssr: false }
)

export function Civilization({ onComplete }: { onComplete?: () => void }) {
  const spacerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)
  const completedRef = useRef(false)

  const handleScroll = useCallback(() => {
    const spacer = spacerRef.current
    if (!spacer) return
    const rect = spacer.getBoundingClientRect()
    const totalHeight = spacer.offsetHeight
    const scrolled = -rect.top
    const p = Math.max(
      0,
      Math.min(1, scrolled / (totalHeight - window.innerHeight))
    )
    setPhase(p)

    if (p >= 0.98 && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }, [onComplete])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <div
      ref={spacerRef}
      className="relative"
      style={{ height: `${CIVILIZATION_HEIGHT}vh` }}
    >
      <section className="sticky top-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#030308]">
        <CivilizationCanvas phase={phase} />
        <CivilizationLabels phase={phase} />
      </section>
    </div>
  )
}
