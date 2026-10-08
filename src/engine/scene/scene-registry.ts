import type { SceneConfig, SceneId } from "../types"
import { defaultScenes } from "./default-scenes"

class SceneRegistry {
  private scenes: Map<string, SceneConfig> = new Map()
  private orderCache: SceneConfig[] | null = null

  register(config: SceneConfig): void {
    if (this.scenes.has(config.id)) {
      console.warn(
        `[SceneRegistry] Scene "${config.id}" is already registered. Overwriting.`
      )
    }
    this.scenes.set(config.id, config)
    this.orderCache = null
  }

  registerMultiple(configs: SceneConfig[]): void {
    for (const config of configs) {
      this.register(config)
    }
  }

  get(id: SceneId | string): SceneConfig | undefined {
    return this.scenes.get(id)
  }

  getAll(): SceneConfig[] {
    return Array.from(this.scenes.values())
  }

  getOrdered(): SceneConfig[] {
    if (this.orderCache) return this.orderCache
    this.orderCache = Array.from(this.scenes.values()).sort(
      (a, b) => a.order - b.order
    )
    return this.orderCache
  }

  getNext(currentId: SceneId | string): SceneConfig | undefined {
    const ordered = this.getOrdered()
    const idx = ordered.findIndex((s) => s.id === currentId)
    if (idx === -1 || idx >= ordered.length - 1) return undefined
    return ordered[idx + 1]
  }

  getPrevious(currentId: SceneId | string): SceneConfig | undefined {
    const ordered = this.getOrdered()
    const idx = ordered.findIndex((s) => s.id === currentId)
    if (idx <= 0) return undefined
    return ordered[idx - 1]
  }

  get totalScenes(): number {
    return this.scenes.size
  }

  has(id: SceneId | string): boolean {
    return this.scenes.has(id)
  }

  unregister(id: SceneId | string): void {
    this.scenes.delete(id)
    this.orderCache = null
  }

  clear(): void {
    this.scenes.clear()
    this.orderCache = null
  }

  loadDefaults(): void {
    this.registerMultiple(defaultScenes)
  }
}

export const sceneRegistry = new SceneRegistry()
