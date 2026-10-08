import { create } from "zustand"

interface HeroState {
  mouseX: number
  mouseY: number
  scrollProgress: number
  isReady: boolean
  setMouse: (x: number, y: number) => void
  setScrollProgress: (p: number) => void
  setIsReady: (v: boolean) => void
}

export const useHeroStore = create<HeroState>((set) => ({
  mouseX: 0,
  mouseY: 0,
  scrollProgress: 0,
  isReady: false,
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
  setScrollProgress: (p) => set({ scrollProgress: p }),
  setIsReady: (v) => set({ isReady: v }),
}))
