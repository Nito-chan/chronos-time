"use client"

import { phaseValue, PHASES } from "./phases"

const GLYPHS = [
  { label: "\u29D6", translation: "Time as a physical medium" },
  { label: "\u29D7", translation: "The cycle of all things" },
  { label: "\u2A01", translation: "Energy through stone" },
]

export function CivilizationLabels({ phase }: { phase: number }) {
  const arrivalLabel = phaseValue(phase, PHASES.ARRIVAL) *
    (1 - phaseValue(phase, PHASES.ARCHITECTURE))
  const obsLabel = phaseValue(phase, PHASES.OBSERVATORY) *
    (1 - phaseValue(phase, { start: PHASES.ARCHITECTURE.start + 0.1, end: 1 }))
  const archLabel = phaseValue(phase, PHASES.ARCHITECTURE) *
    (1 - phaseValue(phase, { start: PHASES.ENERGY.start + 0.1, end: 1 }))
  const energyLabel = phaseValue(phase, PHASES.ENERGY) *
    (1 - phaseValue(phase, { start: PHASES.CHAMBER.start + 0.1, end: 1 }))
  const chamberLabel = phaseValue(phase, PHASES.CHAMBER) *
    (1 - phaseValue(phase, { start: PHASES.REVELATION.start + 0.1, end: 1 }))
  const revelLabel = phaseValue(phase, PHASES.REVELATION)

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="relative h-full w-full">
        <div
          className="absolute left-1/2 top-[25%] -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: arrivalLabel,
            filter: `blur(${(1 - arrivalLabel) * 8}px)`,
          }}
        >
          <p className="font-sans text-center text-[0.5rem] uppercase tracking-[0.4em] text-[#555]">
            Unknown Origin
          </p>
        </div>

        <div
          className="absolute left-8 top-[20%] transition-all duration-1000 ease-out"
          style={{
            opacity: obsLabel,
            filter: `blur(${(1 - obsLabel) * 6}px)`,
            transform: `translateY(${(1 - obsLabel) * 10}px)`,
          }}
        >
          <p className="font-sans text-[0.55rem] uppercase tracking-[0.3em] text-[#D4A853]">
            Observatory
          </p>
          <p className="font-display mt-1 text-[clamp(1rem,2.5vw,2rem)] font-[200] tracking-[0.15em] text-white">
            The Great Instrument
          </p>
          <p className="font-sans mt-2 max-w-[220px] text-[0.5rem] leading-relaxed tracking-[0.15em] text-[#555]">
            Designed by mathematicians. Built by engineers of time.
          </p>
        </div>

        <div
          className="absolute right-10 top-[30%] transition-all duration-1000 ease-out"
          style={{
            opacity: archLabel,
            filter: `blur(${(1 - archLabel) * 6}px)`,
            transform: `translateY(${(1 - archLabel) * 10}px)`,
          }}
        >
          <p className="font-sans text-right text-[0.55rem] uppercase tracking-[0.3em] text-[#8B7355]">
            Architecture
          </p>
          <p className="font-sans mt-2 max-w-[200px] text-right text-[0.5rem] leading-relaxed tracking-[0.12em] text-[#555]">
            Impossible geometry. Floating stone. Precise alignment.
          </p>
        </div>

        <div
          className="absolute left-1/2 top-[60%] -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: energyLabel,
            filter: `blur(${(1 - energyLabel) * 6}px)`,
          }}
        >
          <p className="font-sans text-center text-[0.55rem] uppercase tracking-[0.3em] text-[#F5A623]">
            Energy Rivers
          </p>
          <p className="font-sans mt-2 text-center text-[0.5rem] tracking-[0.12em] text-[#555]">
            Light carved through stone for millennia
          </p>
        </div>

        <div
          className="absolute left-1/2 top-[18%] -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: chamberLabel,
            filter: `blur(${(1 - chamberLabel) * 6}px)`,
          }}
        >
          <p className="font-sans text-center text-[0.55rem] uppercase tracking-[0.35em] text-[#D4A853]">
            Temporal Chamber
          </p>
          <p className="font-display mt-2 text-center text-[clamp(1rem,2vw,1.8rem)] font-[200] tracking-[0.15em] text-white">
            The Core&apos;s Original Resting Place
          </p>
        </div>

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: revelLabel * 0.8,
            filter: `blur(${(1 - revelLabel) * 4}px)`,
          }}
        >
          <p className="font-sans text-center text-[0.5rem] uppercase tracking-[0.6em] text-[#D4A853]">
            Before Time Was Measured
          </p>
          <p className="font-display mt-3 text-center text-[clamp(1.5rem,3.5vw,3rem)] font-[200] tracking-[0.15em] text-white">
            They Understood Time
          </p>
          <p className="font-sans mt-3 text-center text-[clamp(0.6rem,1vw,0.85rem)] font-[300] uppercase tracking-[0.35em] text-[#555]">
            Before We Understood Fire
          </p>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: revelLabel * 0.3,
          }}
        >
          <div className="flex items-center gap-6">
            {GLYPHS.map((g, i) => {
              const glyphShow = phaseValue(phase, {
                start: PHASES.CHAMBER.start + (i / GLYPHS.length) * 0.15,
                end: PHASES.REVELATION.end,
              })
              return (
                <div
                  key={g.label}
                  className="flex flex-col items-center gap-1 transition-all duration-700 ease-out"
                  style={{
                    opacity: glyphShow * 0.8,
                    transform: `translateY(${(1 - glyphShow) * 6}px)`,
                  }}
                >
                  <span className="font-sans text-lg text-[#D4A853]">
                    {g.label}
                  </span>
                  <span className="font-sans max-w-[160px] text-center text-[0.4rem] uppercase tracking-[0.2em] text-[#444]">
                    {g.translation}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
