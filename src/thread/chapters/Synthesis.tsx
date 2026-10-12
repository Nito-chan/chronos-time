"use client"

import { CHAPTERS } from "../story"
import { ChapterShell } from "./ChapterShell"

/**
 * V. Synthesis — the page lifts dark→light across this chapter
 * (handled by gradeAtProgress). Canvas knits the lattice; core rests.
 */
export function Synthesis() {
  const def = CHAPTERS[4]!
  return (
    <ChapterShell def={def} index={4}>
      <p className="t-label pointer-events-none absolute bottom-[9vh] left-1/2 -translate-x-1/2 whitespace-nowrap opacity-70">
        NOTHING SPINS FASTER HERE
      </p>
    </ChapterShell>
  )
}
