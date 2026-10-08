import { useGlobalStore } from "../stores/global-store"
import { eventBus } from "../events/event-bus"
import { sceneRegistry } from "./scene-registry"
import {
  EngineEvent,
  SceneConfig,
  SceneId,
  SceneState,
} from "../types"

type SceneListener = (scene: SceneConfig | null) => void

class SceneManager {
  private listeners: SceneListener[] = []
  private isLoading = false
  private isTransitioning = false

  initialize(): void {
    sceneRegistry.loadDefaults()
    eventBus.emit(EngineEvent.Ready, { type: "scene-manager" })
  }

  async transitionTo(
    id: SceneId | string,
    options?: { immediate?: boolean }
  ): Promise<void> {
    const store = useGlobalStore.getState()
    const targetScene = sceneRegistry.get(id)

    if (!targetScene) {
      console.warn(`[SceneManager] Scene "${id}" not found.`)
      return
    }

    if (this.isTransitioning) return
    this.isTransitioning = true

    const currentId = store.currentScene
    const currentScene = currentId ? sceneRegistry.get(currentId) : null

    store.setPreviousScene(currentId)
    store.setNextScene(id)

    if (currentScene) {
      await this.exitScene(currentScene)
    }

    store.setCurrentScene(id)
    this.notifyListeners(targetScene)
    eventBus.emit(EngineEvent.SceneEnter, { scene: id })

    store.setSceneState(SceneState.Loading)

    await this.enterScene(targetScene, options?.immediate)

    store.setSceneState(SceneState.Active)
    store.setPreviousScene(currentId)
    store.setNextScene(sceneRegistry.getNext(id)?.id ?? null)

    eventBus.emit(EngineEvent.SceneEntered, { scene: id })
    this.isTransitioning = false
  }

  async goToNext(): Promise<void> {
    const store = useGlobalStore.getState()
    const next = sceneRegistry.getNext(store.currentScene ?? "")
    if (next) await this.transitionTo(next.id)
  }

  async goToPrevious(): Promise<void> {
    const store = useGlobalStore.getState()
    const prev = sceneRegistry.getPrevious(store.currentScene ?? "")
    if (prev) await this.transitionTo(prev.id)
  }

  get currentScene(): SceneConfig | undefined {
    const id = useGlobalStore.getState().currentScene
    return id ? sceneRegistry.get(id) : undefined
  }

  get currentSceneId(): SceneId | string | null {
    return useGlobalStore.getState().currentScene
  }

  get previousScene(): SceneConfig | undefined {
    const id = useGlobalStore.getState().previousScene
    return id ? sceneRegistry.get(id) : undefined
  }

  get nextScene(): SceneConfig | undefined {
    const id = useGlobalStore.getState().nextScene
    return id ? sceneRegistry.get(id) : undefined
  }

  get isReady(): boolean {
    return useGlobalStore.getState().isReady
  }

  get sceneState(): SceneState {
    return useGlobalStore.getState().sceneState
  }

  onChange(listener: SceneListener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  destroy(): void {
    this.listeners = []
    this.isLoading = false
    this.isTransitioning = false
    useGlobalStore.getState().reset()
  }

  private async enterScene(
    scene: SceneConfig,
    immediate?: boolean
  ): Promise<void> {
    const store = useGlobalStore.getState()
    this.isLoading = true

    store.setSceneState(SceneState.Entering)
    store.setTransitionState("entering")
    store.setTransitionType(scene.transitions?.enter?.type ?? "dissolve")

    if (immediate) {
      store.setTransitionProgress(1)
      store.setTransitionState("active")
      store.setSceneState(SceneState.Active)
      this.isLoading = false
      return
    }

    const duration = scene.transitions?.enter?.duration ?? 2000
    await this.animateProgress(1, duration)
    store.setTransitionState("active")
    this.isLoading = false
  }

  private async exitScene(scene: SceneConfig): Promise<void> {
    const store = useGlobalStore.getState()

    store.setSceneState(SceneState.Exiting)
    store.setTransitionState("exiting")
    store.setTransitionType(scene.transitions?.exit?.type ?? "fade")

    eventBus.emit(EngineEvent.SceneExit, { scene: scene.id })

    const duration = scene.transitions?.exit?.duration ?? 1500
    await this.animateProgress(0, duration)

    store.setTransitionState("idle")
    store.setSceneState(SceneState.Idle)

    eventBus.emit(EngineEvent.SceneExited, { scene: scene.id })
  }

  private animateProgress(
    target: number,
    duration: number
  ): Promise<void> {
    return new Promise((resolve) => {
      const store = useGlobalStore.getState()
      const start = store.transitionProgress
      const startTime = performance.now()

      const step = (now: number): void => {
        const elapsed = now - startTime
        const t = Math.min(1, elapsed / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        const current = start + (target - start) * eased

        store.setTransitionProgress(current)

        if (t < 1) {
          requestAnimationFrame(step)
        } else {
          store.setTransitionProgress(target)
          resolve()
        }
      }

      requestAnimationFrame(step)
    })
  }

  private notifyListeners(scene: SceneConfig | null): void {
    for (const listener of this.listeners) {
      listener(scene)
    }
  }
}

export const sceneManager = new SceneManager()
