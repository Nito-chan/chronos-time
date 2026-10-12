"use client"

/**
 * The Long Thread — story data.
 * Copy is final (design-lead brief). Scroll lengths in viewport heights.
 */

export interface ChapterGrade {
  bg: string
  ink: string
  ink2: string
  accent: string
  accent2?: string
  grain: number // 0..1 overlay opacity scale
  vignette: boolean
}

export interface ChapterDef {
  id: string
  numeral: string
  label: string
  date: string
  headline: string
  headlineEmphasis: string // italic phrase inside headline (must occur in headline)
  body: string
  vh: number
  grade: ChapterGrade
  align: "left" | "right"
}

export const CHAPTERS: ChapterDef[] = [
  {
    id: "genesis",
    numeral: "I",
    label: "Genesis",
    date: "13.8 BYA",
    headline: "First, a point. Then, a direction.",
    headlineEmphasis: "a direction",
    body: "Time did not begin with a bang. It began with a direction: dense to spread out, one to many. Everything after this is that direction continuing.",
    vh: 5,
    grade: {
      bg: "#05060F",
      ink: "#E9ECF8",
      ink2: "#A9B3D6",
      accent: "#8FA8FF",
      grain: 1,
      vignette: true,
    },
    align: "left",
  },
  {
    id: "memory",
    numeral: "II",
    label: "Memory",
    date: "3000 BCE",
    headline: "Someone cut a mark in stone. That was the first clock.",
    headlineEmphasis: "first clock",
    body: "People began counting days against the sky and carving the count into rock. Time stopped being weather and became something you could keep.",
    vh: 4,
    grade: {
      bg: "#1A1410",
      ink: "#F0E4CC",
      ink2: "#C9B48E",
      accent: "#C9893B",
      accent2: "#2F4B8F",
      grain: 0.9,
      vignette: true,
    },
    align: "right",
  },
  {
    id: "fracture",
    numeral: "III",
    label: "Fracture",
    date: "1760",
    headline: "Then time got a schedule.",
    headlineEmphasis: "a schedule",
    body: "Factories needed everyone in the same hour. Clocks moved from the church tower to the wrist. A river became a shift.",
    vh: 3.5,
    grade: {
      bg: "#14100D",
      ink: "#EFE6DC",
      ink2: "#C4B49E",
      accent: "#D4A64A",
      accent2: "#FFB84D",
      grain: 0.55,
      vignette: true,
    },
    align: "left",
  },
  {
    id: "signal",
    numeral: "IV",
    label: "Signal",
    date: "1990",
    headline: "Now everything has a timestamp.",
    headlineEmphasis: "a timestamp",
    body: "First telegraphs, then networks. Every message, photo and payment picked up a time and kept it. For the first time, the past became searchable.",
    vh: 3,
    grade: {
      bg: "#07141A",
      ink: "#D6F2F0",
      ink2: "#93B8B4",
      accent: "#3EE0D0",
      grain: 0.35,
      vignette: true,
    },
    align: "right",
  },
  {
    id: "synthesis",
    numeral: "V",
    label: "Synthesis",
    date: "2042 · PROJECTED",
    headline: "The record starts to read itself.",
    headlineEmphasis: "read itself",
    body: "When an archive gets large enough, patterns appear. CHRONOS is where that happens for time: a record you can ask questions of.",
    vh: 3,
    grade: {
      bg: "#0B1A22",
      ink: "#D6F2F0",
      ink2: "#93B8B4",
      accent: "#B9A7F2",
      accent2: "#E3C98F",
      grain: 0.12,
      vignette: false,
    },
    align: "left",
  },
  {
    id: "instrument",
    numeral: "VI",
    label: "The Instrument",
    date: "NOW",
    headline: "The story becomes a tool.",
    headlineEmphasis: "a tool",
    body: "Move through 13.8 billion years with millisecond precision. Branch alternate histories and see how one decision changes the outcome. Travel the timeline the way you would travel a map.",
    vh: 4,
    grade: {
      bg: "#ECEFF3",
      ink: "#0E1220",
      ink2: "#4A5266",
      accent: "#3347FF",
      grain: 0.05,
      vignette: false,
    },
    align: "left",
  },
  {
    id: "present",
    numeral: "VII",
    label: "Present",
    date: "YOU ARE HERE",
    headline: "You are here. Where do you want to go?",
    headlineEmphasis: "Where do you want to go?",
    body: "No credit card. The free tier includes the full timeline.",
    vh: 1,
    grade: {
      bg: "#ECEFF3",
      ink: "#0E1220",
      ink2: "#4A5266",
      accent: "#3347FF",
      grain: 0.05,
      vignette: false,
    },
    align: "left",
  },
]

export const THRESHOLD_VH = 1.1

/** Total scroll length in vh (threshold + chapters). */
export const TOTAL_VH =
  THRESHOLD_VH + CHAPTERS.reduce((n, c) => n + c.vh, 0)
