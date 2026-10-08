"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { DiscoveryLabels } from "./discovery-labels"

const DISCOVERY_HEIGHT = 400

const DiscoveryCanvas = dynamic(
  () =>
    import("./discovery-scene").then((m) => ({ default: m.DiscoveryCanvas })),
  { ssr: false }
)

export function Discovery({ onComplete }: { onComplete?: () => void }) {
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
      style={{ height: `${DISCOVERY_HEIGHT}vh` }}
    >
      <section className="sticky top-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#050505]">
        <DiscoveryCanvas phase={phase} />
        <DiscoveryLabels phase={phase} />
      </section>
    </div>
  )
}
