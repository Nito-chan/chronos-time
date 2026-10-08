"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useGlobalStore } from "../stores/global-store"
import { eventBus } from "../events/event-bus"
import { scrollEngine } from "../scroll/scroll-engine"
import { sceneManager } from "../scene/scene-manager"
import { cameraController } from "../camera/camera-controller"
import { motionController } from "../motion/motion-controller"
import { timelineController } from "../motion/timeline-controller"
import { transitionEngine } from "../transitions/transition-engine"
import { performanceManager } from "../performance/performance-manager"
import { EngineEvent } from "../types"

interface EngineAPI {
  scroll: typeof scrollEngine
  scenes: typeof sceneManager
  camera: typeof cameraController
  motion: typeof motionController
  timelines: typeof timelineController
  transitions: typeof transitionEngine
  performance: typeof performanceManager
  events: typeof eventBus
  store: typeof useGlobalStore
  isReady: boolean
}

const EngineContext = createContext<EngineAPI | null>(null)

interface EngineProviderProps {
  children: ReactNode
  enableDebug?: boolean
}

export function EngineProvider({
  children,
  enableDebug = false,
}: EngineProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const initialized = useRef(false)
  const setDebugMode = useGlobalStore((s) => s.setDebugMode)
  const setViewport = useGlobalStore((s) => s.setViewport)
  const setReducedMotion = useGlobalStore((s) => s.setReducedMotion)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    if (enableDebug) {
      setDebugMode(true)
    }

    performanceManager.initialize()
    motionController.initialize()
    sceneManager.initialize()
    cameraController.initialize()
    transitionEngine.initialize()
    scrollEngine.initialize()

    const motionPref = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(motionPref.matches)

    const handleMotionChange = (e: MediaQueryListEvent): void => {
      setReducedMotion(e.matches)
      motionController.setReducedMotion(e.matches)
    }
    motionPref.addEventListener("change", handleMotionChange)

    const handleViewport = (): void => {
      setViewport(window.innerWidth, window.innerHeight, window.devicePixelRatio)
    }
    window.addEventListener("resize", handleViewport)

    const scrollUnsub = scrollEngine.onScroll((state) => {
      cameraController.updateScroll(state.progress)
    })

    const mouseHandler = (e: MouseEvent): void => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      cameraController.updateMouse(x, y)
    }
    window.addEventListener("mousemove", mouseHandler)

    setIsReady(true)
    useGlobalStore.getState().setIsReady(true)
    eventBus.emit(EngineEvent.Ready, { type: "engine" })

    return () => {
      motionPref.removeEventListener("change", handleMotionChange)
      window.removeEventListener("resize", handleViewport)
      window.removeEventListener("mousemove", mouseHandler)
      scrollUnsub()
      scrollEngine.destroy()
      cameraController.destroy()
      motionController.destroy()
      timelineController.destroyAll()
      transitionEngine.destroy()
      performanceManager.destroy()
    }
  }, [enableDebug, setDebugMode, setViewport, setReducedMotion])

  const api: EngineAPI = {
    scroll: scrollEngine,
    scenes: sceneManager,
    camera: cameraController,
    motion: motionController,
    timelines: timelineController,
    transitions: transitionEngine,
    performance: performanceManager,
    events: eventBus,
    store: useGlobalStore,
    isReady,
  }

  return (
    <EngineContext.Provider value={api}>{children}</EngineContext.Provider>
  )
}

export function useEngine(): EngineAPI {
  const context = useContext(EngineContext)
  if (!context) {
    throw new Error("useEngine must be used within an EngineProvider")
  }
  return context
}
