"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { GenesisText } from "./genesis-text"

const GENESIS_HEIGHT = 400

const GenesisCanvas = dynamic(
  () =>
    import("./genesis-scene").then((m) => ({ default: m.GenesisCanvas })),
  { ssr: false }
)

export function Genesis({ onComplete }: { onComplete?: () => void }) {
  const spacerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const completedRef = useRef(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }
    window.addEventListener("mousemove", handler)
    return () => window.removeEventListener("mousemove", handler)
  }, [])

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
      style={{ height: `${GENESIS_HEIGHT}vh` }}
    >
      <section className="sticky top-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#050505]">
        <GenesisCanvas phase={phase} mouseX={mouse.x} mouseY={mouse.y} />
        <GenesisText phase={phase} />
      </section>
    </div>
  )
}
