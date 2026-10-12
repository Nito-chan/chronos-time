"use client"

import { create } from "zustand"

interface ThreadState {
  /** Global scroll progress 0..1 (updated via direct set, no react churn in loops). */
  progress: number
  chapterIndex: number // -1 = threshold, 0..6 chapters
  reducedMotion: boolean
  paused: boolean
  soundOn: boolean
  ready: boolean
  setProgress: (p: number, chapter: number) => void
  setReducedMotion: (v: boolean) => void
  setPaused: (v: boolean) => void
  setSoundOn: (v: boolean) => void
  setReady: (v: boolean) => void
}

export const useThreadStore = create<ThreadState>((set) => ({
  progress: 0,
  chapterIndex: -1,
  reducedMotion: false,
  paused: false,
  soundOn: false,
  ready: false,
  setProgress: (progress, chapterIndex) =>
    set((s) =>
      s.progress === progress && s.chapterIndex === chapterIndex
        ? s
        : { progress, chapterIndex }
    ),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setPaused: (v) => set({ paused: v }),
  setSoundOn: (v) => set({ soundOn: v }),
  setReady: (v) => set({ ready: v }),
}))

/** Shared mutable scroll snapshot for rAF loops (no re-render). */
export const scrollSnapshot = {
  y: 0,
  vh: 1,
  doc: 1,
  progress: 0,
  /** Quantized per-chapter still when reduced motion is on. */
  displayProgress: 0,
  velocity: 0,
}
