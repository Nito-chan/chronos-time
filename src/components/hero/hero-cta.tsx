"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

function MagneticButton({
  children,
  className = "",
  primary = false,
}: {
  children: React.ReactNode
  className?: string
  primary?: boolean
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15
    setPos({ x, y })
  }

  const handleLeave = () => {
    setPos({ x: 0, y: 0 })
  }

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={`relative cursor-pointer transition-shadow duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        primary
          ? "bg-[#F5F5F5] text-[#0A0A0A] hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]"
          : "border border-[rgba(255,255,255,0.12)] text-[#F5F5F5] hover:border-[#22D3EE] hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]"
      } ${className}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: "transform 0.15s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </button>
  )
}

export function HeroCTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (!el || reduced) return
    const btns = el.querySelectorAll("button")
    let done = false
    const tween = gsap.fromTo(
      btns,
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.15,
        delay: 5.8,
        ease: "power3.out",
        onComplete: () => {
          done = true
        },
      }
    )
    // Safety net: never leave CTAs invisible if the ticker stalls.
    const failsafe = window.setTimeout(
      () => {
        if (!done) {
          tween.kill()
          gsap.set(btns, { opacity: 1, y: 0, scale: 1 })
        }
      },
      (5.8 + 0.7 + 4) * 1000
    )
    return () => {
      window.clearTimeout(failsafe)
      tween.kill()
    }
  }, [reduced])

  return (
    <div
      ref={containerRef}
      className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5"
      style={reduced ? undefined : { opacity: 0 }}
    >
      <MagneticButton primary className="h-12 rounded-[6px] px-8 text-[0.75rem] font-[500] uppercase tracking-[0.15em]">
        Enter Chronos
      </MagneticButton>
      <MagneticButton className="h-12 rounded-[6px] px-8 text-[0.75rem] font-[500] uppercase tracking-[0.15em]">
        Begin Timeline
      </MagneticButton>
    </div>
  )
}
