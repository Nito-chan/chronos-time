import { gsap } from "gsap"

interface TimelineLabel {
  label: string
  position: number | string
}

interface TimelineConfig {
  id: string
  paused?: boolean
  smoothChildTiming?: boolean
  autoRemoveChildren?: boolean
  onComplete?: () => void
  onReverseComplete?: () => void
}

class TimelineController {
  private timelines: Map<string, gsap.core.Timeline> = new Map()
  private labelCounters: Map<string, number> = new Map()

  create(config: TimelineConfig): gsap.core.Timeline {
    this.destroy(config.id)

    const tl = gsap.timeline({
      ...config,
      paused: config.paused ?? true,
      smoothChildTiming: config.smoothChildTiming ?? true,
      autoRemoveChildren: config.autoRemoveChildren ?? false,
      onComplete: () => {
        config.onComplete?.()
      },
      onReverseComplete: () => {
        config.onReverseComplete?.()
      },
    })

    this.timelines.set(config.id, tl)
    return tl
  }

  get(id: string): gsap.core.Timeline | undefined {
    return this.timelines.get(id)
  }

  play(id: string): void {
    this.timelines.get(id)?.play()
  }

  pause(id: string): void {
    this.timelines.get(id)?.pause()
  }

  resume(id: string): void {
    this.timelines.get(id)?.resume()
  }

  reverse(id: string): void {
    this.timelines.get(id)?.reverse()
  }

  restart(id: string): void {
    this.timelines.get(id)?.restart()
  }

  seek(id: string, time: number): void {
    this.timelines.get(id)?.seek(time)
  }

  seekLabel(id: string, label: string): void {
    this.timelines.get(id)?.seek(label)
  }

  setProgress(id: string, progress: number): void {
    const tl = this.timelines.get(id)
    if (tl) {
      const duration = tl.duration()
      tl.seek(duration * progress)
    }
  }

  getProgress(id: string): number {
    const tl = this.timelines.get(id)
    if (!tl) return 0
    const duration = tl.duration()
    if (duration <= 0) return 0
    return tl.time() / duration
  }

  getDuration(id: string): number {
    return this.timelines.get(id)?.duration() ?? 0
  }

  isActive(id: string): boolean {
    return this.timelines.get(id)?.isActive() ?? false
  }

  totalDuration(id: string): number {
    return this.timelines.get(id)?.totalDuration() ?? 0
  }

  addTween(
    id: string,
    target: gsap.TweenTarget,
    vars: gsap.TweenVars,
    position?: number | string
  ): gsap.core.Timeline {
    const tl = this.timelines.get(id)
    if (!tl) {
      console.warn(`[TimelineController] Timeline "${id}" not found.`)
      return gsap.timeline()
    }
    return tl.to(target, vars, position)
  }

  addFrom(
    id: string,
    target: gsap.TweenTarget,
    vars: gsap.TweenVars,
    position?: number | string
  ): gsap.core.Timeline {
    const tl = this.timelines.get(id)
    if (!tl) {
      console.warn(`[TimelineController] Timeline "${id}" not found.`)
      return gsap.timeline()
    }
    return tl.from(target, vars, position)
  }

  addFromTo(
    id: string,
    target: gsap.TweenTarget,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    position?: number | string
  ): gsap.core.Timeline {
    const tl = this.timelines.get(id)
    if (!tl) {
      console.warn(`[TimelineController] Timeline "${id}" not found.`)
      return gsap.timeline()
    }
    return tl.fromTo(target, fromVars, toVars, position)
  }

  addCallback(
    id: string,
    callback: () => void,
    position?: number | string
  ): gsap.core.Timeline {
    const tl = this.timelines.get(id)
    if (!tl) {
      console.warn(`[TimelineController] Timeline "${id}" not found.`)
      return gsap.timeline()
    }
    return tl.call(callback, [], position)
  }

  addLabel(id: string, label: string, position?: string | number): void {
    const tl = this.timelines.get(id)
    if (!tl) return
    tl.addLabel(label, position)
  }

  getLabels(id: string): TimelineLabel[] {
    const tl = this.timelines.get(id)
    if (!tl) return []
    const labels = tl.labels ?? {}
    return Object.entries(labels).map(([label, position]) => ({
      label,
      position,
    }))
  }

  timeScale(id: string, scale: number): void {
    this.timelines.get(id)?.timeScale(scale)
  }

  clearLabels(id: string): void {
    const timeline = this.timelines.get(id)
    if (timeline) {
      for (const label of Object.keys(timeline.labels ?? {})) {
        delete timeline.labels[label]
      }
    }
  }

  destroy(id: string): void {
    const existing = this.timelines.get(id)
    if (existing) {
      existing.kill()
      this.timelines.delete(id)
      this.labelCounters.delete(id)
    }
  }

  destroyAll(): void {
    for (const [id] of this.timelines) {
      this.destroy(id)
    }
  }
}

export const timelineController = new TimelineController()
export type { TimelineConfig, TimelineLabel }
