// Types
export type {
  SceneId,
  TransitionType,
  PerformanceTier,
  Vec3,
  CameraPreset,
  CameraKeyframe,
  TransitionConfig,
  SceneTransition,
  SceneConfig,
  ScrollState,
  PerformanceProfile,
  EventListener,
} from "./types"
export { SceneState, EngineEvent } from "./types"

// Store
export { useGlobalStore } from "./stores/global-store"
export type { GlobalState, GlobalActions } from "./stores/global-store"

// Events
export { eventBus } from "./events/event-bus"

// Scroll
export { scrollEngine } from "./scroll/scroll-engine"
export type { ScrollEngineConfig } from "./scroll/scroll-engine"

// Scene
export { sceneRegistry } from "./scene/scene-registry"
export { sceneManager } from "./scene/scene-manager"
export { defaultScenes } from "./scene/default-scenes"

// Camera
export { cameraController } from "./camera/camera-controller"
export type { CameraState, DriftConfig, BreathConfig } from "./camera/camera-controller"

// Motion
export { motionController } from "./motion/motion-controller"
export type { TweenConfig, MotionOptions } from "./motion/motion-controller"

// Timeline
export { timelineController } from "./motion/timeline-controller"
export type { TimelineConfig, TimelineLabel } from "./motion/timeline-controller"

// Transitions
export { transitionEngine } from "./transitions/transition-engine"

// Performance
export { performanceManager } from "./performance/performance-manager"
export type { PerformanceThresholds } from "./performance/performance-manager"
export { PROFILES } from "./performance/performance-manager"

// Debug
export { DebugPanel } from "./debug/debug-panel"

// React
export { EngineProvider, useEngine } from "./react/engine-context"
