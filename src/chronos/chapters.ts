export interface ChapterDef {
  id: string
  index: string
  kicker: string
  timestamp: string
  title: string
  titleAccent?: string
  body: string
  align: "left" | "center" | "right"
  numeral: string
  tint: string
  durationVh: number
}

export const CHAPTERS: ChapterDef[] = [
  {
    id: "void",
    index: "00",
    kicker: "Prologue",
    timestamp: "BEFORE — / — TIME",
    title: "Before time was measured,",
    titleAccent: "they understood it.",
    body: "Scroll to descend. Each breath takes you deeper — from silence, through stone and signal, into the machine that remembers everything.",
    align: "center",
    numeral: "∞",
    tint: "rgba(255,255,255,0.02)",
    durationVh: 100,
  },
  {
    id: "genesis",
    index: "I",
    kicker: "Genesis",
    timestamp: "13.8 BYA — ORIGIN",
    title: "Energy awakens.",
    titleAccent: "The first force stirs.",
    body: "From a single point of infinite density, time begins. The crystal assembles — fragment by fragment — like starlight caught in ice.",
    align: "left",
    numeral: "13.8",
    tint: "rgba(139,92,246,0.06)",
    durationVh: 150,
  },
  {
    id: "memory",
    index: "II",
    kicker: "Memory",
    timestamp: "3000 BCE — CIVILIZATION",
    title: "Stone remembers",
    titleAccent: "what flesh forgets.",
    body: "Writing. Astronomy. Architecture aligned to stars. The first ring closes around the crystal — humanity builds its first observatory of time.",
    align: "right",
    numeral: "3000",
    tint: "rgba(212,168,83,0.05)",
    durationVh: 150,
  },
  {
    id: "fracture",
    index: "III",
    kicker: "Fracture",
    timestamp: "1760 — INDUSTRY",
    title: "Steam cracks",
    titleAccent: "the circle open.",
    body: "The rings spin faster, then break. Gold sparks fly. Time is no longer a river — it is a machine, and it never stops.",
    align: "left",
    numeral: "1760",
    tint: "rgba(245,166,35,0.06)",
    durationVh: 100,
  },
  {
    id: "signal",
    index: "IV",
    kicker: "Signal",
    timestamp: "1990 — INFORMATION",
    title: "Knowledge becomes",
    titleAccent: "infinite light.",
    body: "Invisible networks of data wrap the planet. Particles densify into rain. The threads brighten — every moment, recorded.",
    align: "right",
    numeral: "1990",
    tint: "rgba(34,211,238,0.06)",
    durationVh: 100,
  },
  {
    id: "synthesis",
    index: "V",
    kicker: "Synthesis",
    timestamp: "2042 — SYNTHESIS",
    title: "Intelligence transcends",
    titleAccent: "biology.",
    body: "A global neural network awakens. The full Temporal Core revealed — calm, breathing, eternal. Nothing stops. Nothing accelerates.",
    align: "center",
    numeral: "2042",
    tint: "rgba(34,211,238,0.05)",
    durationVh: 100,
  },
  {
    id: "instrument",
    index: "VI",
    kicker: "Epilogue — The Instrument",
    timestamp: "NOW — CHRONOS OS",
    title: "Observe. Simulate.",
    titleAccent: "Navigate.",
    body: "The story becomes a tool. Three instruments — one for seeing time, one for branching it, one for traveling it.",
    align: "center",
    numeral: "NOW",
    tint: "transparent",
    durationVh: 120,
  },
]
