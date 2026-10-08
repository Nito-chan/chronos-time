import { useGlobalStore } from "../stores/global-store"
import { eventBus } from "../events/event-bus"
import {
  EngineEvent,
  PerformanceProfile,
  PerformanceTier,
} from "../types"

interface PerformanceThresholds {
  lowFpsThreshold: number
  mediumFpsThreshold: number
  sampleFrames: number
  checkInterval: number
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lowFpsThreshold: 30,
  mediumFpsThreshold: 50,
  sampleFrames: 30,
  checkInterval: 2000,
}

const PROFILES: Record<PerformanceTier, PerformanceProfile> = {
  ultra: {
    tier: "ultra",
    maxParticles: 10000,
    postProcessing: true,
    shadows: true,
    shaderQuality: "high",
    animationIntensity: 1,
    maxLOD: 3,
    useBloom: true,
  },
  high: {
    tier: "high",
    maxParticles: 5000,
    postProcessing: true,
    shadows: true,
    shaderQuality: "high",
    animationIntensity: 0.85,
    maxLOD: 2,
    useBloom: true,
  },
  medium: {
    tier: "medium",
    maxParticles: 2500,
    postProcessing: false,
    shadows: false,
    shaderQuality: "medium",
    animationIntensity: 0.6,
    maxLOD: 1,
    useBloom: true,
  },
  low: {
    tier: "low",
    maxParticles: 800,
    postProcessing: false,
    shadows: false,
    shaderQuality: "low",
    animationIntensity: 0.3,
    maxLOD: 0,
    useBloom: false,
  },
}

class PerformanceManager {
  private thresholds: PerformanceThresholds
  private frameTimes: number[] = []
  private lastCheck = 0
  private running = false
  private animFrameId: number | null = null
  private lastFrameTime = 0
  private currentTier: PerformanceTier = "high"
  private reducedMotion = false

  constructor(thresholds?: Partial<PerformanceThresholds>) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds }
  }

  initialize(): void {
    this.running = true
    this.lastFrameTime = performance.now()
    this.currentTier = this.detectHardwareTier()
    this.reducedMotion = this.detectReducedMotion()

    const store = useGlobalStore.getState()
    store.setPerformanceTier(this.currentTier)
    store.setReducedMotion(this.reducedMotion)

    this.startMonitoring()

    eventBus.emit(EngineEvent.Ready, { type: "performance" })
    eventBus.emit(EngineEvent.PerformanceChange, {
      tier: this.currentTier,
    })
  }

  destroy(): void {
    this.running = false
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
    this.frameTimes = []
  }

  get profile(): PerformanceProfile {
    return PROFILES[this.currentTier]
  }

  get tier(): PerformanceTier {
    return this.currentTier
  }

  getProfileForTier(tier: PerformanceTier): PerformanceProfile {
    return PROFILES[tier] ?? PROFILES.high
  }

  private detectHardwareTier(): PerformanceTier {
    if (typeof window === "undefined") return "high"

    const { hardwareConcurrency, deviceMemory } = navigator as unknown as {
      hardwareConcurrency?: number
      deviceMemory?: number
    }

    let score = 0

    if (hardwareConcurrency) {
      if (hardwareConcurrency >= 8) score += 2
      else if (hardwareConcurrency >= 4) score += 1
    } else {
      score += 1
    }

    if (deviceMemory) {
      if (deviceMemory >= 8) score += 2
      else if (deviceMemory >= 4) score += 1
    } else {
      score += 1
    }

    if (typeof WebGLRenderingContext !== "undefined") {
      try {
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl2")
        if (gl) {
          score += 1
        }
      } catch {
        // WebGL not available
      }
    }

    if (window.matchMedia("(prefers-reduced-data: reduce)").matches) {
      score -= 1
    }

    if (score >= 5) return "ultra"
    if (score >= 3) return "high"
    if (score >= 1) return "medium"
    return "low"
  }

  private detectReducedMotion(): boolean {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }

  private startMonitoring(): void {
    const monitor = (time: number): void => {
      if (!this.running) return
      this.animFrameId = requestAnimationFrame(monitor)

      const delta = time - this.lastFrameTime
      this.lastFrameTime = time

      if (delta > 0) {
        this.frameTimes.push(1000 / delta)
      }

      const now = performance.now()
      if (now - this.lastCheck >= this.thresholds.checkInterval) {
        this.lastCheck = now
        this.evaluate()
      }
    }

    this.animFrameId = requestAnimationFrame(monitor)
  }

  private evaluate(): void {
    if (this.frameTimes.length < this.thresholds.sampleFrames * 0.5) return

    const recent = this.frameTimes.slice(-this.thresholds.sampleFrames)
    const avgFps =
      recent.reduce((sum, fps) => sum + fps, 0) / recent.length

    const store = useGlobalStore.getState()
    store.setFps(Math.round(avgFps))

    const newTier = this.determineTier(avgFps)
    if (newTier !== this.currentTier) {
      this.currentTier = newTier
      store.setPerformanceTier(newTier)
      eventBus.emit(EngineEvent.PerformanceChange, { tier: newTier })
    }

    if (this.frameTimes.length > this.thresholds.sampleFrames * 2) {
      this.frameTimes = this.frameTimes.slice(-this.thresholds.sampleFrames)
    }
  }

  private determineTier(avgFps: number): PerformanceTier {
    if (avgFps >= 55) return this.currentTier === "ultra" ? "ultra" : "high"
    if (avgFps >= this.thresholds.mediumFpsThreshold) return "medium"
    return "low"
  }
}

export const performanceManager = new PerformanceManager()
export type { PerformanceThresholds }
export { PROFILES }
