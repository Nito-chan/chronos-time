"use client"

import { SmoothScroll } from "./SmoothScroll"
import { ThreadCanvas } from "./ThreadCanvas"
import { PersistentUI } from "./PersistentUI"
import { Threshold } from "./chapters/Threshold"
import { Genesis } from "./chapters/Genesis"
import { Memory } from "./chapters/Memory"
import { Fracture } from "./chapters/Fracture"
import { Signal } from "./chapters/Signal"
import { Synthesis } from "./chapters/Synthesis"
import { Instrument } from "./chapters/Instrument"
import { Present } from "./chapters/Present"

/**
 * The Long Thread — one continuous story about time.
 * Text lives in the DOM (real headings, readable without scripts);
 * the Thread and chapter scenes render on one fixed canvas behind it.
 */
export function StoryPage() {
  return (
    <main id="top" className="relative">
      <SmoothScroll />
      <ThreadCanvas />
      <PersistentUI />

      <div className="relative z-10">
        <Threshold />
        <Genesis />
        <Memory />
        <Fracture />
        <Signal />
        <Synthesis />
        <Instrument />
        <Present />
      </div>

      <noscript>
        <style>{`
          #chronos-instrument, #chronos-present { background: #ECEFF3 !important; color: #0E1220 !important; }
          #chronos-instrument *, #chronos-present * { text-shadow: none !important; }
          #chronos-instrument .t-body, #chronos-present .t-body { color: #4A5266 !important; }
        `}</style>
      </noscript>
    </main>
  )
}
