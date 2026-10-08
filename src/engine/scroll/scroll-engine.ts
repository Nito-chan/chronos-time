import Lenis from "lenis"
import { useGlobalStore } from "../stores/global-store"
import { eventBus } from "../events/event-bus"
import { EngineEvent, ScrollState } from "../types"

type ScrollCallback = (state: ScrollState) => void

interface ScrollEngineConfig {
  duration?: number
  easing?: (t: number) => number
  orientation?: "vertical" | "horizontal"
  gestureOrientation?: "vertical" | "horizontal"
  smoothWheel?: boolean
  wheelMultiplier?: number
  touchMultiplier?: number
  infinite?: boolean
}

const DEFAULT_CONFIG: ScrollEngineConfig = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  infinite: false,
}

class ScrollEngine {
  private lenis: Lenis | null = null
  private rafId: number | null = null
  private callbacks: ScrollCallback[] = []
  private config: ScrollEngineConfig
  private isPaused = false
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null

  constructor(config?: Partial<ScrollEngineConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  initialize(): void {
    if (this.lenis) return

    this.lenis = new Lenis({
      duration: this.config.duration,
      easing: this.config.easing,
      orientation: this.config.orientation,
      gestureOrientation: this.config.gestureOrientation,
      smoothWheel: this.config.smoothWheel,
      wheelMultiplier: this.config.wheelMultiplier,
      touchMultiplier: this.config.touchMultiplier,
      infinite: this.config.infinite,
    })

    this.lenis.on("scroll", this.handleScroll)
    this.startLoop()

    eventBus.emit(EngineEvent.Ready, { type: "scroll" })
  }

  destroy(): void {
    this.stopLoop()

    if (this.lenis) {
      this.lenis.off("scroll", this.handleScroll)
      this.lenis.destroy()
      this.lenis = null
    }

    this.callbacks = []
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout)
  }

  onScroll(callback: ScrollCallback): () => void {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  scrollTo(
    target: number | string | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ): void {
    if (!this.lenis) return
    this.lenis.scrollTo(target, options)
  }

  pause(): void {
    this.isPaused = true
    if (this.lenis) this.lenis.stop()
  }

  resume(): void {
    this.isPaused = false
    if (this.lenis) this.lenis.start()
  }

  get progress(): number {
    return useGlobalStore.getState().scrollProgress
  }

  get velocity(): number {
    return useGlobalStore.getState().scrollVelocity
  }

  get isLocked(): boolean {
    return useGlobalStore.getState().scrollLocked
  }

  set isLocked(locked: boolean) {
    useGlobalStore.getState().setScrollLocked(locked)
    if (locked) this.pause()
    else this.resume()
  }

  snapTo(
    target: number | string | HTMLElement,
    options?: { duration?: number }
  ): void {
    if (!this.lenis) return
    this.lenis.scrollTo(target, { ...options, lock: true })
  }

  private handleScroll = (e: Lenis): void => {
    const store = useGlobalStore.getState()
    const progress = Math.max(0, Math.min(1, e.progress))
    const velocity = e.velocity
    const direction =
      velocity > 0.01 ? "down" : velocity < -0.01 ? "up" : "none"

    const wasScrolling = store.isScrolling

    store.setScrollState({
      progress,
      velocity: Math.abs(velocity),
      direction,
      isScrolling: Math.abs(velocity) > 0.01,
    })

    if (!wasScrolling && Math.abs(velocity) > 0.01) {
      eventBus.emit(EngineEvent.ScrollStart, { progress, velocity, direction })
    }

    eventBus.emit(EngineEvent.ScrollProgress, { progress, velocity, direction })

    if (wasScrolling && Math.abs(velocity) <= 0.01) {
      if (this.scrollTimeout) clearTimeout(this.scrollTimeout)
      this.scrollTimeout = setTimeout(() => {
        eventBus.emit(EngineEvent.ScrollStop, {
          progress: useGlobalStore.getState().scrollProgress,
        })
      }, 150)
    }

    for (const cb of this.callbacks) {
      cb({ progress, velocity: Math.abs(velocity), direction, isScrolling: Math.abs(velocity) > 0.01 })
    }
  }

  private startLoop(): void {
    const raf = (time: number): void => {
      if (this.lenis && !this.isPaused) {
        this.lenis.raf(time)
      }
      this.rafId = requestAnimationFrame(raf)
    }
    this.rafId = requestAnimationFrame(raf)
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }
}

export const scrollEngine = new ScrollEngine()
export type { ScrollEngineConfig }
