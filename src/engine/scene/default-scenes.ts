import type { SceneConfig } from "../types"

export const defaultScenes: SceneConfig[] = [
  {
    id: "void",
    name: "The Void",
    description: "Before time began. Pure darkness with distant light.",
    order: 0,
    transitions: {
      enter: { type: "dissolve", duration: 2000 },
      exit: { type: "dissolve", duration: 1500 },
    },
    requiresAssets: false,
  },
  {
    id: "birth",
    name: "Birth of Time",
    description:
      "The first moment. The Temporal Core ignites. Time becomes real.",
    order: 1,
    transitions: {
      enter: { type: "bloom", duration: 2500, intensity: 0.6 },
      exit: { type: "fade", duration: 1200 },
    },
    requiresAssets: true,
  },
  {
    id: "ancient",
    name: "Ancient Era",
    description:
      "Civilizations rise. Pyramids, aqueducts, star charts carved in stone.",
    order: 2,
    transitions: {
      enter: { type: "dissolve", duration: 2000 },
      exit: { type: "fade", duration: 1500 },
    },
    requiresAssets: true,
  },
  {
    id: "industrial",
    name: "Industrial Age",
    description:
      "Machines awaken. Steam, steel, and the birth of precision.",
    order: 3,
    transitions: {
      enter: { type: "camera-travel", duration: 3000 },
      exit: { type: "bloom", duration: 2000, intensity: 0.4 },
    },
    requiresAssets: true,
  },
  {
    id: "information",
    name: "Information Era",
    description:
      "Data flows. Networks connect. Knowledge becomes instantaneous.",
    order: 4,
    transitions: {
      enter: { type: "particle-burst", duration: 2000 },
      exit: { type: "dissolve", duration: 1500 },
    },
    requiresAssets: true,
  },
  {
    id: "ai",
    name: "The Intelligence",
    description:
      "Machines begin to think. The singularity approaches.",
    order: 5,
    transitions: {
      enter: { type: "bloom", duration: 2500, intensity: 0.7 },
      exit: { type: "camera-travel", duration: 3000 },
    },
    requiresAssets: true,
  },
  {
    id: "beyond",
    name: "Beyond Time",
    description:
      "What exists after the last moment? The Core transcends.",
    order: 6,
    transitions: {
      enter: { type: "fade", duration: 3000 },
      exit: { type: "dissolve", duration: 2000 },
    },
    requiresAssets: true,
  },
  {
    id: "collapse",
    name: "The Collapse",
    description:
      "Time fractures. The rings break. Everything unwinds.",
    order: 7,
    transitions: {
      enter: { type: "shader", duration: 2500 },
      exit: { type: "particle-burst", duration: 2000 },
    },
    requiresAssets: true,
  },
  {
    id: "loop",
    name: "The Loop",
    description:
      "Time resets. The cycle begins again. The Core remembers.",
    order: 8,
    transitions: {
      enter: { type: "camera-travel", duration: 3000 },
      exit: { type: "fade", duration: 2000 },
    },
    requiresAssets: true,
  },
  {
    id: "hero",
    name: "Hero",
    description: "The opening cinematic experience.",
    order: -1,
    transitions: {
      enter: { type: "dissolve", duration: 1000 },
      exit: { type: "fade", duration: 800 },
    },
    requiresAssets: true,
  },
]
