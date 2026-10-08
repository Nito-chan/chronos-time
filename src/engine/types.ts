export type SceneId =
  | "void"
  | "birth"
  | "ancient"
  | "industrial"
  | "information"
  | "ai"
  | "beyond"
  | "collapse"
  | "loop"

export type TransitionType =
  | "dissolve"
  | "bloom"
  | "fade"
  | "camera-travel"
  | "shader"
  | "particle-burst"
  | "typography"

export type PerformanceTier = "low" | "medium" | "high" | "ultra"

export type CameraAxis = "x" | "y" | "z"

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface CameraPreset {
  position: Vec3
  target?: Vec3
  fov?: number
  near?: number
  far?: number
}

export interface CameraKeyframe {
  preset: CameraPreset
  duration: number
  ease?: string
}

export interface TransitionConfig {
  type: TransitionType
  duration: number
  ease?: string
  intensity?: number
}

export interface SceneTransition {
  enter?: TransitionConfig
  exit?: TransitionConfig
}

export enum SceneState {
  Idle = "idle",
  Loading = "loading",
  Entering = "entering",
  Active = "active",
  Exiting = "exiting",
  Destroyed = "destroyed",
}

export interface SceneConfig {
  id: SceneId | string
  name: string
  description?: string
  order: number
  cameraPreset?: CameraPreset
  transitions?: SceneTransition
  requiresAssets?: boolean
}

export enum EngineEvent {
  SceneEnter = "scene:enter",
  SceneEntered = "scene:entered",
  SceneExit = "scene:exit",
  SceneExited = "scene:exited",
  ScrollStart = "scroll:start",
  ScrollStop = "scroll:stop",
  ScrollProgress = "scroll:progress",
  TransitionStart = "transition:start",
  TransitionEnd = "transition:end",
  PerformanceChange = "performance:change",
  MotionToggle = "motion:toggle",
  CoreActivated = "core:activated",
  CoreHover = "core:hover",
  CoreLeave = "core:leave",
  TimeFracture = "time:fracture",
  Resize = "viewport:resize",
  Ready = "engine:ready",
}

export interface ScrollState {
  progress: number
  velocity: number
  direction: "up" | "down" | "none"
  isScrolling: boolean
}

export interface PerformanceProfile {
  tier: PerformanceTier
  maxParticles: number
  postProcessing: boolean
  shadows: boolean
  shaderQuality: "low" | "medium" | "high"
  animationIntensity: number
  maxLOD: number
  useBloom: boolean
}

export type EventListener = (...args: unknown[]) => void
