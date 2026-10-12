"use client"

import { CHAPTERS } from "../story"
import { ChapterShell } from "./ChapterShell"

/** I. Genesis — pinned text over the scrubbed particle/crystal canvas. */
export function Genesis() {
  const def = CHAPTERS[0]!
  return <ChapterShell def={def} index={0} />
}
