"use client"

import { PHASES, phaseValue } from "./phases"

interface PhaseText {
  phase: keyof typeof PHASES
  title: string
  subtitle?: string
  color?: string
}

const TEXTS: PhaseText[] = [
  {
    phase: "ENERGY",
    title: "Energy Awakens",
    subtitle: "The first force stirs",
    color: "#22D3EE",
  },
  {
    phase: "COSMIC",
    title: "Cosmic Formation",
    subtitle: "Stars ignite. Galaxies form.",
    color: "#8B5CF6",
  },
  {
    phase: "TIME",
    title: "The Flow of Time",
    subtitle: "Temporal streams emerge",
    color: "#D4A853",
  },
  {
    phase: "STRUCTURE",
    title: "First Structure",
    subtitle: "Evidence of intelligent order",
    color: "#F5F5F5",
  },
]

export function GenesisText({ phase }: { phase: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      {TEXTS.map((text) => {
        const window = PHASES[text.phase]
        const opacity = phaseValue(phase, window) * (1 - phaseValue(phase, { start: window.end - 0.05, end: window.end + 0.05 }))
        const y = (1 - opacity) * 12

        return (
          <div
            key={text.phase}
            className="absolute flex flex-col items-center gap-3 text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: opacity * 0.9,
              transform: `translateY(${y}px)`,
              filter: `blur(${(1 - opacity) * 6}px)`,
              pointerEvents: "none",
            }}
          >
            <h2
              className="font-display text-[clamp(1.5rem,4vw,3.5rem)] font-[200] leading-[1.1] tracking-[-0.02em]"
              style={{ color: text.color ?? "#F5F5F5" }}
            >
              {text.title}
            </h2>
            {text.subtitle && (
              <p className="font-sans text-[clamp(0.75rem,1.2vw,1rem)] font-[400] uppercase tracking-[0.25em] text-[#737373]">
                {text.subtitle}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
