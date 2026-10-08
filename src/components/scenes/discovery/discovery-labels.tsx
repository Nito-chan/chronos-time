"use client"

import { phaseValue, phaseRange, PHASES } from "./phases"

const TIMELINE_ERAS = [
  { label: "13.8 BYA", desc: "Origin" },
  { label: "4.5 BYA", desc: "Earth Forms" },
  { label: "500 MYA", desc: "Complex Life" },
  { label: "3000 BCE", desc: "Civilization" },
  { label: "1760", desc: "Industry" },
  { label: "1990", desc: "Information" },
  { label: "2042", desc: "Synthesis" },
]

export function DiscoveryLabels({ phase }: { phase: number }) {
  const pathwayLabelOpacity = phaseValue(phase, PHASES.PATHWAYS) *
    (1 - phaseValue(phase, PHASES.HOLOGRAM))
  const holoLabelOpacity = phaseValue(phase, PHASES.HOLOGRAM) *
    (1 - phaseValue(phase, { start: PHASES.REVEAL.start + 0.1, end: 1 }))
  const revealOpacity = phaseValue(phase, PHASES.REVEAL)
  const timelineShow = phaseValue(phase, PHASES.TIMELINES)

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="relative h-full w-full">
        <div
          className="absolute left-8 top-[15%] transition-all duration-1000 ease-out"
          style={{
            opacity: pathwayLabelOpacity,
            filter: `blur(${(1 - pathwayLabelOpacity) * 8}px)`,
            transform: `translateY(${(1 - pathwayLabelOpacity) * 10}px)`,
          }}
        >
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#737373]">
            Observation
          </p>
          <p className="font-display mt-2 text-[clamp(1rem,2.5vw,2rem)] font-[200] tracking-[0.15em] text-white">
            TEMPORAL PATHWAYS
          </p>
        </div>

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: holoLabelOpacity,
            filter: `blur(${(1 - holoLabelOpacity) * 6}px)`,
          }}
        >
          <p className="font-sans text-center text-[0.55rem] uppercase tracking-[0.35em] text-[#D4A853]">
            Chronos System
          </p>
          <p className="font-display mt-3 text-center text-[clamp(1.2rem,3vw,2.5rem)] font-[200] tracking-[0.12em] text-white">
            TEMPORAL CORE
          </p>
          <p className="font-sans mt-4 text-center text-[0.6rem] uppercase tracking-[0.25em] text-[#555]">
            Time Navigation Interface
          </p>
        </div>

        <div
          className="absolute left-1/2 top-[15%] -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: revealOpacity,
            filter: `blur(${(1 - revealOpacity) * 4}px)`,
          }}
        >
          <p className="font-sans text-center text-[0.5rem] uppercase tracking-[0.5em] text-[#D4A853]">
            System Online
          </p>
          <h1 className="font-display mt-2 text-center text-[clamp(2rem,6vw,5rem)] font-[200] tracking-[0.2em] text-white">
            C H R O N O S
          </h1>
          <p className="font-sans mt-3 text-center text-[clamp(0.65rem,1vw,0.85rem)] font-[300] uppercase tracking-[0.4em] text-[#737373]">
            Navigating Time
          </p>
        </div>

        <div
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: timelineShow,
            filter: `blur(${(1 - timelineShow) * 6}px)`,
          }}
        >
          <div className="flex items-end gap-8">
            {TIMELINE_ERAS.map((era, i) => {
              const nodePhase = phaseRange(phase, {
                start: PHASES.TIMELINES.start + (i / TIMELINE_ERAS.length) * 0.2,
                end: PHASES.REVEAL.end,
              })
              return (
                <div
                  key={era.label}
                  className="flex flex-col items-center gap-2 transition-all duration-700 ease-out"
                  style={{
                    opacity: nodePhase,
                    transform: `translateY(${(1 - nodePhase) * 8}px)`,
                  }}
                >
                  <div
                    className="h-[2px] w-[2px] rounded-full"
                    style={{
                      backgroundColor: i === TIMELINE_ERAS.length - 1 ? "#D4A853" : "#555",
                      boxShadow: i === TIMELINE_ERAS.length - 1
                        ? "0 0 6px #D4A853"
                        : "none",
                    }}
                  />
                  <span className="font-mono text-[0.5rem] tracking-[0.15em] text-[#555]">
                    {era.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="absolute bottom-8 right-8 transition-all duration-1000 ease-out"
          style={{
            opacity: revealOpacity * 0.5,
            filter: `blur(${(1 - revealOpacity) * 4}px)`,
          }}
        >
          <p className="font-sans text-right text-[0.45rem] uppercase tracking-[0.3em] text-[#444]">
            Temporal Navigation System v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
