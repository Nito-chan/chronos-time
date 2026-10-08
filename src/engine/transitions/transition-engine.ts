import { gsap } from "gsap"
import { useGlobalStore } from "../stores/global-store"
import { eventBus } from "../events/event-bus"
import { cameraController } from "../camera/camera-controller"
import {
  EngineEvent,
  TransitionConfig,
  CameraPreset,
} from "../types"

type TransitionCallback = (progress: number) => void

class TransitionEngine {
  private activeTransition: TransitionConfig | null = null
  private isTransitioning = false
  private callbacks: TransitionCallback[] = []
  private currentTween: gsap.core.Tween | null = null

  initialize(): void {
    eventBus.emit(EngineEvent.Ready, { type: "transition" })
  }

  async play(
    config: TransitionConfig,
    options?: { cameraPreset?: CameraPreset }
  ): Promise<void> {
    if (this.isTransitioning) return
    this.isTransitioning = true
    this.activeTransition = config

    const store = useGlobalStore.getState()
    store.setTransitionType(config.type)
    store.setTransitionState("entering")
    store.setTransitionProgress(0)

    eventBus.emit(EngineEvent.TransitionStart, {
      type: config.type,
      duration: config.duration,
    })

    if (options?.cameraPreset) {
      cameraController.setPreset(options.cameraPreset, config.duration * 0.6)
    }

    try {
      switch (config.type) {
        case "dissolve":
          await this.playDissolve(config)
          break
        case "fade":
          await this.playFade(config)
          break
        case "bloom":
          await this.playBloom(config)
          break
        case "camera-travel":
          await this.playCameraTravel(config)
          break
        case "particle-burst":
          await this.playParticleBurst(config)
          break
        default:
          await this.playDissolve(config)
      }
    } finally {
      store.setTransitionState("active")
      store.setTransitionProgress(1)
      this.isTransitioning = false
      this.activeTransition = null

      eventBus.emit(EngineEvent.TransitionEnd, { type: config.type })
    }
  }

  async reverse(config: TransitionConfig): Promise<void> {
    // Exit transitions are basically reverses of enter transitions
    await this.play({
      ...config,
      duration: config.duration * 0.8,
    })
  }

  onProgress(callback: TransitionCallback): () => void {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  get isActive(): boolean {
    return this.isTransitioning
  }

  destroy(): void {
    this.currentTween?.kill()
    this.activeTransition = null
    this.isTransitioning = false
    this.callbacks = []
    useGlobalStore.getState().setTransitionState("idle")
  }

  private async playDissolve(config: TransitionConfig): Promise<void> {
    return this.animate(0, 1, config.duration, config.ease)
  }

  private async playFade(config: TransitionConfig): Promise<void> {
    return this.animate(0, 1, config.duration, config.ease)
  }

  private async playBloom(config: TransitionConfig): Promise<void> {
    return this.animate(0, 1, config.duration, config.ease)
  }

  private async playCameraTravel(config: TransitionConfig): Promise<void> {
    return this.animate(0, 1, config.duration, config.ease)
  }

  private async playParticleBurst(config: TransitionConfig): Promise<void> {
    return this.animate(0, 1, config.duration, config.ease)
  }

  private animate(
    from: number,
    to: number,
    duration: number,
    ease?: string
  ): Promise<void> {
    return new Promise((resolve) => {
      const store = useGlobalStore.getState()
      const obj = { value: from }

      this.currentTween = gsap.to(obj, {
        value: to,
        duration: duration / 1000,
        ease: ease ?? "power3.inOut",
        onUpdate: () => {
          store.setTransitionProgress(obj.value)
          for (const cb of this.callbacks) {
            cb(obj.value)
          }
        },
        onComplete: resolve,
      })
    })
  }
}

export const transitionEngine = new TransitionEngine()
