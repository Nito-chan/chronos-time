"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export function HeroScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (!el || reduced) return

    const intro = gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        delay: 7.5,
        ease: "power3.out",
      }
    )

    const failsafe = window.setTimeout(() => {
      gsap.set(el, { opacity: 1 })
    }, (7.5 + 0.6 + 4) * 1000)

    const line = gsap.to(el.querySelector(".indicator-line"), {
      y: 6,
      opacity: 0.3,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    const breathe = gsap.to(el, {
      opacity: 0.25,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 7.8,
    })

    return () => {
      window.clearTimeout(failsafe)
      intro.kill()
      line.kill()
      breathe.kill()
    }
  }, [reduced])

  return (
    <div
      ref={containerRef}
      className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      style={reduced ? { opacity: 0.6 } : { opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="font-sans text-[0.625rem] font-[400] uppercase tracking-[0.2em] text-[#525252]">
          Scroll
        </span>
        <div className="flex flex-col items-center gap-[3px]">
          <div className="indicator-line h-[1px] w-[1px] rounded-full bg-[#A3A3A3]" />
          <div className="indicator-line h-[1px] w-[1px] rounded-full bg-[#A3A3A3]" />
          <div className="indicator-line h-[1px] w-[1px] rounded-full bg-[#A3A3A3]" />
        </div>
      </div>
    </div>
  )
}
