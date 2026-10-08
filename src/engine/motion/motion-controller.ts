import { gsap } from "gsap"
import { useGlobalStore } from "../stores/global-store"

type TweenTarget = gsap.TweenTarget

interface TweenConfig {
  target: TweenTarget
  vars: gsap.TweenVars
  id?: string
  immediate?: boolean
}

interface MotionOptions {
  duration?: number
  ease?: string
  delay?: number
  stagger?: number
  immediateRender?: boolean
  overwrite?: boolean | "auto"
  id?: string
}

const DEFAULT_OPTIONS: MotionOptions = {
  duration: 0.8,
  ease: "power3.out",
  delay: 0,
  stagger: 0,
  immediateRender: false,
  overwrite: "auto",
}

class MotionController {
  private registry: Map<string, gsap.core.Tween | gsap.core.Timeline> =
    new Map()
  private reducedMotion = false
  private paused = false

  initialize(): void {
    this.reducedMotion = useGlobalStore.getState().isReducedMotion
    this.paused = !useGlobalStore.getState().motionEnabled

    gsap.defaults({
      ease: "power3.out",
      overwrite: "auto",
    })
  }

  to(
    target: TweenTarget,
    vars: gsap.TweenVars,
    options?: Partial<MotionOptions>
  ): gsap.core.Tween {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    const merged = this.prepareVars(vars, opts)

    const tween = gsap.to(target, merged)

    if (opts.id) {
      this.kill(opts.id)
      this.registry.set(opts.id, tween)
      tween.eventCallback("onComplete", () => {
        this.registry.delete(opts.id ?? "")
      })
    }

    return tween
  }

  from(
    target: TweenTarget,
    vars: gsap.TweenVars,
    options?: Partial<MotionOptions>
  ): gsap.core.Tween {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    const merged = this.prepareVars(vars, opts)

    const tween = gsap.from(target, merged)

    if (opts.id) {
      this.kill(opts.id)
      this.registry.set(opts.id, tween)
      tween.eventCallback("onComplete", () => {
        this.registry.delete(opts.id ?? "")
      })
    }

    return tween
  }

  fromTo(
    target: TweenTarget,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    options?: Partial<MotionOptions>
  ): gsap.core.Tween {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    const merged = this.prepareVars(toVars, opts)

    const tween = gsap.fromTo(target, fromVars, merged)

    if (opts.id) {
      this.kill(opts.id)
      this.registry.set(opts.id, tween)
      tween.eventCallback("onComplete", () => {
        this.registry.delete(opts.id ?? "")
      })
    }

    return tween
  }

  set(
    target: TweenTarget,
    vars: gsap.TweenVars
  ): gsap.core.Tween {
    return gsap.set(target, vars)
  }

  kill(id: string): void {
    const existing = this.registry.get(id)
    if (existing) {
      existing.kill()
      this.registry.delete(id)
    }
  }

  killAll(): void {
    for (const [, tween] of this.registry) {
      tween.kill()
    }
    this.registry.clear()
  }

  pause(id: string): void {
    this.registry.get(id)?.pause()
  }

  resume(id: string): void {
    this.registry.get(id)?.play()
  }

  reverse(id: string): void {
    this.registry.get(id)?.reverse()
  }

  getProgress(id: string): number {
    return this.registry.get(id)?.progress() ?? 0
  }

  setProgress(id: string, progress: number): void {
    this.registry.get(id)?.progress(progress)
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced
    if (reduced) {
      gsap.globalTimeline.timeScale(0)
    } else {
      gsap.globalTimeline.timeScale(1)
    }
  }

  setPaused(paused: boolean): void {
    this.paused = paused
    if (paused) {
      gsap.globalTimeline.pause()
    } else {
      gsap.globalTimeline.play()
    }
  }

  get activeTweens(): number {
    return this.registry.size
  }

  destroy(): void {
    this.killAll()
  }

  private prepareVars(
    vars: gsap.TweenVars,
    options: MotionOptions
  ): gsap.TweenVars {
    const merged: gsap.TweenVars = {
      ...vars,
      duration: this.reducedMotion ? 0.01 : options.duration,
      ease: options.ease,
      delay: this.reducedMotion ? 0 : options.delay,
      immediateRender: options.immediateRender,
      overwrite: options.overwrite,
    }

    if (options.stagger) {
      merged.stagger = this.reducedMotion ? 0 : options.stagger
    }

    return merged
  }
}

export const motionController = new MotionController()
export type { TweenConfig, MotionOptions }
