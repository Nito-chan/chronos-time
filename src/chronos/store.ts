"use client"

import { create } from "zustand"

interface ChronosState {
  progress: number
  chapter: number
  mouseX: number
  mouseY: number
  ready: boolean
  reducedMotion: boolean
  setProgress: (p: number) => void
  setChapter: (c: number) => void
  setMouse: (x: number, y: number) => void
  setReady: (r: boolean) => void
  setReducedMotion: (r: boolean) => void
}

export const useChronosStore = create<ChronosState>((set) => ({
  progress: 0,
  chapter: 0,
  mouseX: 0,
  mouseY: 0,
  ready: false,
  reducedMotion: false,
  setProgress: (p) => set({ progress: p }),
  setChapter: (c) => set({ chapter: c }),
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
  setReady: (r) => set({ ready: r }),
  setReducedMotion: (r) => set({ reducedMotion: r }),
}))

export const EASE_SMOOTH = "cubic-bezier(0.16, 1, 0.3, 1)"
