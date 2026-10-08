import { useGlobalStore } from "../stores/global-store"
import { eventBus } from "../events/event-bus"
import {
  CameraPreset,
  EngineEvent,
  Vec3,
} from "../types"

type CameraUpdateCallback = (state: CameraState) => void

interface CameraState {
  position: Vec3
  target: Vec3
  fov: number
}

interface DriftConfig {
  amplitude: Vec3
  speed: Vec3
  enabled: boolean
}

interface BreathConfig {
  amplitude: number
  speed: number
  enabled: boolean
}

const DEFAULT_PRESET: CameraPreset = {
  position: { x: 0, y: 0, z: 14 },
  target: { x: 0, y: 0, z: 0 },
  fov: 40,
}

const DEFAULT_DRIFT: DriftConfig = {
  amplitude: { x: 0.25, y: 0.15, z: 0.1 },
  speed: { x: 0.08, y: 0.06, z: 0.1 },
  enabled: true,
}

const DEFAULT_BREATH: BreathConfig = {
  amplitude: 0.4,
  speed: 0.4,
  enabled: true,
}

const PARALLAX_FACTOR = 0.08

class CameraController {
  private currentPreset: CameraPreset = { ...DEFAULT_PRESET }
  private targetPreset: CameraPreset | null = null
  private transitionStart = 0
  private transitionDuration = 0
  private time = 0
  private mouseX = 0
  private mouseY = 0
  private scrollProgress = 0
  private isTransitioning = false

  private driftConfig: DriftConfig = { ...DEFAULT_DRIFT }
  private breathConfig: BreathConfig = { ...DEFAULT_BREATH }

  private callbacks: CameraUpdateCallback[] = []
  private animFrameId: number | null = null
  private running = false

  initialize(): void {
    this.running = true
    this.time = 0
    this.tick()
    eventBus.emit(EngineEvent.Ready, { type: "camera" })
  }

  destroy(): void {
    this.running = false
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
    this.callbacks = []
  }

  setPreset(preset: CameraPreset, duration = 0): void {
    if (duration <= 0) {
      this.currentPreset = { ...preset }
      this.targetPreset = null
      this.isTransitioning = false
      this.applyToStore()
      return
    }

    this.targetPreset = { ...preset }
    this.transitionStart = this.time
    this.transitionDuration = duration
    this.isTransitioning = true
  }

  setDrift(config: Partial<DriftConfig>): void {
    this.driftConfig = { ...this.driftConfig, ...config }
  }

  setBreath(config: Partial<BreathConfig>): void {
    this.breathConfig = { ...this.breathConfig, ...config }
  }

  updateMouse(x: number, y: number): void {
    this.mouseX = x
    this.mouseY = y
  }

  updateScroll(progress: number): void {
    this.scrollProgress = progress
  }

  getPreset(): CameraPreset {
    return { ...this.currentPreset }
  }

  getComputedState(): CameraState {
    return {
      position: this.getComputedPosition(),
      target: this.getComputedTarget(),
      fov: this.getComputedFov(),
    }
  }

  onUpdate(callback: CameraUpdateCallback): () => void {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  reset(): void {
    this.currentPreset = { ...DEFAULT_PRESET }
    this.targetPreset = null
    this.driftConfig = { ...DEFAULT_DRIFT }
    this.breathConfig = { ...DEFAULT_BREATH }
    this.isTransitioning = false
    this.time = 0
    this.applyToStore()
  }

  private tick = (): void => {
    if (!this.running) return
    this.time += 0.016

    if (this.isTransitioning) {
      this.updateTransition()
    }

    const state = this.getComputedState()

    for (const cb of this.callbacks) {
      cb(state)
    }

    this.animFrameId = requestAnimationFrame(this.tick)
  }

  private updateTransition(): void {
    if (!this.targetPreset) return

    const elapsed = this.time - this.transitionStart
    const t = Math.min(1, elapsed / this.transitionDuration)
    const eased = 1 - Math.pow(1 - t, 3)

    this.currentPreset = {
      position: {
        x: this.lerp(
          this.currentPreset.position.x,
          this.targetPreset.position.x,
          eased
        ),
        y: this.lerp(
          this.currentPreset.position.y,
          this.targetPreset.position.y,
          eased
        ),
        z: this.lerp(
          this.currentPreset.position.z,
          this.targetPreset.position.z,
          eased
        ),
      },
      target: this.targetPreset.target
        ? {
            x: this.lerp(
              this.currentPreset.target?.x ?? 0,
              this.targetPreset.target.x,
              eased
            ),
            y: this.lerp(
              this.currentPreset.target?.y ?? 0,
              this.targetPreset.target.y,
              eased
            ),
            z: this.lerp(
              this.currentPreset.target?.z ?? 0,
              this.targetPreset.target.z,
              eased
            ),
          }
        : undefined,
      fov: this.targetPreset.fov
        ? this.lerp(
            this.currentPreset.fov ?? 40,
            this.targetPreset.fov,
            eased
          )
        : this.currentPreset.fov,
    }

    this.applyToStore()

    if (t >= 1) {
      this.isTransitioning = false
      eventBus.emit(EngineEvent.Ready, {
        type: "camera-transition-complete",
      })
    }
  }

  private getComputedPosition(): Vec3 {
    const base = this.currentPreset.position
    const t = this.time

    const driftX = this.driftConfig.enabled
      ? Math.sin(t * this.driftConfig.speed.x) *
        this.driftConfig.amplitude.x
      : 0
    const driftY = this.driftConfig.enabled
      ? Math.cos(t * this.driftConfig.speed.y) *
        this.driftConfig.amplitude.y
      : 0
    const driftZ = this.driftConfig.enabled
      ? Math.sin(t * this.driftConfig.speed.z) *
        this.driftConfig.amplitude.z
      : 0

    const parallaxX = this.mouseX * PARALLAX_FACTOR
    const parallaxY = this.mouseY * PARALLAX_FACTOR

    const scrollDolly = this.scrollProgress * 6
    const scrollSwayX =
      Math.sin(t * 0.15) * this.scrollProgress * 0.3

    return {
      x: base.x + driftX + parallaxX + scrollSwayX,
      y: base.y + driftY + parallaxY,
      z: base.z + driftZ - scrollDolly,
    }
  }

  private getComputedTarget(): Vec3 {
    return {
      x: this.currentPreset.target?.x ?? 0,
      y: this.currentPreset.target?.y ?? 0,
      z: this.currentPreset.target?.z ?? 0,
    }
  }

  private getComputedFov(): number {
    const base = this.currentPreset.fov ?? 40
    const breath = this.breathConfig.enabled
      ? Math.sin(this.time * this.breathConfig.speed) *
        this.breathConfig.amplitude
      : 0
    return base + breath
  }

  private applyToStore(): void {
    const store = useGlobalStore.getState()
    store.setCameraPreset(this.currentPreset)
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }
}

export const cameraController = new CameraController()
export type { CameraState, DriftConfig, BreathConfig }
