"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

function splitChars(text: string): string[] {
  return text.split("").map((char) => (char === " " ? "\u00A0" : char))
}

function CharsReveal({
  text,
  className,
  stagger = 0.04,
  duration = 0.7,
  delay = 0,
  blur = 12,
  y = 24,
}: {
  text: string
  className?: string
  stagger?: number
  duration?: number
  delay?: number
  blur?: number
  y?: number
}) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const chars = splitChars(text)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (!el || reduced) return
    const spans = el.querySelectorAll<HTMLSpanElement>(".char-span")
    let done = false
    const tween = gsap.fromTo(
      spans,
      {
        opacity: 0,
        filter: `blur(${blur}px)`,
        y: y,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration,
        stagger,
        delay,
        ease: "power3.out",
        onComplete: () => {
          done = true
        },
      }
    )
    // Safety net: if the GSAP ticker ever stalls (throttled rAF, script
    // hiccup), never leave the headline invisible.
    const failsafe = window.setTimeout(
      () => {
        if (!done) {
          tween.kill()
          gsap.set(spans, { opacity: 1, filter: "blur(0px)", y: 0 })
        }
      },
      (delay + duration + 4) * 1000
    )
    return () => {
      window.clearTimeout(failsafe)
      tween.kill()
    }
  }, [blur, delay, duration, stagger, y, reduced])

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {chars.map((char, i) => (
        <span
          key={i}
          className="char-span inline-block"
          style={
            reduced
              ? undefined
              : { opacity: 0, filter: `blur(${blur}px)` }
          }
        >
          {char}
        </span>
      ))}
    </span>
  )
}

function FadeIn({
  children,
  delay = 0,
  y = 16,
  duration = 0.8,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let done = false
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        onComplete: () => {
          done = true
        },
      }
    )
    const failsafe = window.setTimeout(
      () => {
        if (!done) {
          tween.kill()
          gsap.set(el, { opacity: 1, y: 0 })
        }
      },
      (delay + duration + 4) * 1000
    )
    return () => {
      window.clearTimeout(failsafe)
      tween.kill()
    }
  }, [delay, duration, y, reduced])

  return (
    <div ref={ref} className={className} style={reduced ? undefined : { opacity: 0 }}>
      {children}
    </div>
  )
}

export function HeroText() {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-[200] leading-[0.9] tracking-[-0.03em] text-[#F5F5F5]">
        <CharsReveal
          text="CHRONOS"
          stagger={0.06}
          duration={0.8}
          delay={2.5}
          blur={16}
          y={30}
        />
      </h1>

      <FadeIn delay={4} y={20} duration={0.8}>
        <p className="font-sans text-[clamp(1rem,2vw,1.5rem)] font-[300] tracking-[0.15em] text-[#A3A3A3] uppercase">
          The Operating System For Time
        </p>
      </FadeIn>

      <FadeIn delay={5} y={16} duration={0.6}>
        <p className="font-sans text-[clamp(0.875rem,1.2vw,1.125rem)] font-[400] tracking-[0.3em] text-[#737373] uppercase">
          Observe. Simulate. Navigate.
        </p>
      </FadeIn>
    </div>
  )
}
