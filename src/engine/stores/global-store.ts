import { create } from "zustand"
import {
  SceneState,
} from "../types"
import type {
  SceneId,
  CameraPreset,
  TransitionType,
  PerformanceTier,
  ScrollState,
} from "../types"

export interface GlobalState {
  currentScene: SceneId | string | null
  previousScene: SceneId | string | null
  nextScene: SceneId | string | null
  sceneState: SceneState
  scrollProgress: number
  scrollVelocity: number
  scrollDirection: "up" | "down" | "none"
  isScrolling: boolean
  scrollLocked: boolean
  cameraPreset: CameraPreset | null
  cameraTargetPreset: CameraPreset | null
  cameraTransitionProgress: number
  lightingPreset: string
  motionEnabled: boolean
  transitionState: "idle" | "entering" | "exiting" | "active"
  transitionType: TransitionType | null
  transitionProgress: number
  performanceTier: PerformanceTier
  fps: number
  debugMode: boolean
  viewportWidth: number
  viewportHeight: number
  pixelRatio: number
  isReducedMotion: boolean
  isReady: boolean
  activeScenes: string[]
}

export interface GlobalActions {
  setCurrentScene: (scene: SceneId | string | null) => void
  setPreviousScene: (scene: SceneId | string | null) => void
  setNextScene: (scene: SceneId | string | null) => void
  setSceneState: (state: SceneState) => void
  setScrollState: (state: Partial<ScrollState>) => void
  setScrollLocked: (locked: boolean) => void
  setCameraPreset: (preset: CameraPreset | null) => void
  setCameraTargetPreset: (preset: CameraPreset | null) => void
  setCameraTransitionProgress: (progress: number) => void
  setLightingPreset: (preset: string) => void
  setMotionEnabled: (enabled: boolean) => void
  setTransitionState: (
    state: "idle" | "entering" | "exiting" | "active"
  ) => void
  setTransitionType: (type: TransitionType | null) => void
  setTransitionProgress: (progress: number) => void
  setPerformanceTier: (tier: PerformanceTier) => void
  setFps: (fps: number) => void
  setDebugMode: (mode: boolean) => void
  setViewport: (width: number, height: number, ratio: number) => void
  setReducedMotion: (reduced: boolean) => void
  setIsReady: (ready: boolean) => void
  registerActiveScene: (id: string) => void
  unregisterActiveScene: (id: string) => void
  reset: () => void
}

const initialState: GlobalState = {
  currentScene: null,
  previousScene: null,
  nextScene: null,
  sceneState: SceneState.Idle,
  scrollProgress: 0,
  scrollVelocity: 0,
  scrollDirection: "none",
  isScrolling: false,
  scrollLocked: false,
  cameraPreset: null,
  cameraTargetPreset: null,
  cameraTransitionProgress: 0,
  lightingPreset: "default",
  motionEnabled: true,
  transitionState: "idle",
  transitionType: null,
  transitionProgress: 0,
  performanceTier: "high",
  fps: 0,
  debugMode: false,
  viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1920,
  viewportHeight: typeof window !== "undefined" ? window.innerHeight : 1080,
  pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 2,
  isReducedMotion: false,
  isReady: false,
  activeScenes: [],
}

export const useGlobalStore = create<GlobalState & GlobalActions>(
  (set) => ({
    ...initialState,

    setCurrentScene: (scene) => set({ currentScene: scene }),
    setPreviousScene: (scene) => set({ previousScene: scene }),
    setNextScene: (scene) => set({ nextScene: scene }),
    setSceneState: (state) => set({ sceneState: state }),
    setScrollState: (partial) =>
      set((s) => ({
        scrollProgress: partial.progress ?? s.scrollProgress,
        scrollVelocity: partial.velocity ?? s.scrollVelocity,
        scrollDirection: partial.direction ?? s.scrollDirection,
        isScrolling: partial.isScrolling ?? s.isScrolling,
      })),
    setScrollLocked: (locked) => set({ scrollLocked: locked }),
    setCameraPreset: (preset) => set({ cameraPreset: preset }),
    setCameraTargetPreset: (preset) => set({ cameraTargetPreset: preset }),
    setCameraTransitionProgress: (progress) =>
      set({ cameraTransitionProgress: progress }),
    setLightingPreset: (preset) => set({ lightingPreset: preset }),
    setMotionEnabled: (enabled) => set({ motionEnabled: enabled }),
    setTransitionState: (state) => set({ transitionState: state }),
    setTransitionType: (type) => set({ transitionType: type }),
    setTransitionProgress: (progress) => set({ transitionProgress: progress }),
    setPerformanceTier: (tier) => set({ performanceTier: tier }),
    setFps: (fps) => set({ fps }),
    setDebugMode: (mode) => set({ debugMode: mode }),
    setViewport: (width, height, ratio) =>
      set({ viewportWidth: width, viewportHeight: height, pixelRatio: ratio }),
    setReducedMotion: (reduced) => set({ isReducedMotion: reduced }),
    setIsReady: (ready) => set({ isReady: ready }),
    registerActiveScene: (id) =>
      set((s) => ({
        activeScenes: s.activeScenes.includes(id)
          ? s.activeScenes
          : [...s.activeScenes, id],
      })),
    unregisterActiveScene: (id) =>
      set((s) => ({
        activeScenes: s.activeScenes.filter((x) => x !== id),
      })),
    reset: () => set(initialState),
  })
)
