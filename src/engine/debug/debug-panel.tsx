"use client"

import { useEffect, useState, useCallback } from "react"
import { useGlobalStore } from "../stores/global-store"
import { sceneManager } from "../scene/scene-manager"
import { performanceManager } from "../performance/performance-manager"

export function DebugPanel() {
  const [visible, setVisible] = useState(false)

  const currentScene = sceneManager.currentScene
  const sceneState = useGlobalStore((s) => s.sceneState)
  const scrollProgress = useGlobalStore((s) => s.scrollProgress)
  const fps = useGlobalStore((s) => s.fps)
  const scrollVelocity = useGlobalStore((s) => s.scrollVelocity)
  const transitionState = useGlobalStore((s) => s.transitionState)
  const transitionType = useGlobalStore((s) => s.transitionType)
  const transitionProgress = useGlobalStore((s) => s.transitionProgress)
  const performanceTier = useGlobalStore((s) => s.performanceTier)
  const cameraPreset = useGlobalStore((s) => s.cameraPreset)
  const motionEnabled = useGlobalStore((s) => s.motionEnabled)
  const isReducedMotion = useGlobalStore((s) => s.isReducedMotion)
  const viewportWidth = useGlobalStore((s) => s.viewportWidth)
  const viewportHeight = useGlobalStore((s) => s.viewportHeight)
  const activeScenes = useGlobalStore((s) => s.activeScenes)
  const debugMode = useGlobalStore((s) => s.debugMode)

  const toggle = useCallback(() => {
    setVisible((v) => !v)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" && e.shiftKey) {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggle])

  if (!visible && !debugMode) return null

  const profile = performanceManager.profile

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] min-w-[280px] rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.92)] p-4 font-mono text-[11px] leading-relaxed text-[#A3A3A3] shadow-2xl backdrop-blur-xl"
      style={{ fontFamily: "monospace" }}
    >
      <div className="mb-2 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#525252]">
          CHRONOS Engine
        </span>
        <button
          onClick={toggle}
          className="cursor-pointer border-none bg-transparent text-[#525252] hover:text-[#F5F5F5]"
        >
          ✕
        </button>
      </div>

      <div className="space-y-[3px]">
        <Row label="FPS" value={`${fps}`} highlight={fps < 30} />
        <Row
          label="Scene"
          value={currentScene?.name ?? "—"}
          highlight={!!currentScene}
        />
        <Row label="Scene State" value={sceneState} />
        <Row label="Scroll Progress" value={scrollProgress.toFixed(3)} />
        <Row label="Scroll Velocity" value={scrollVelocity.toFixed(2)} />
        <Row label="Transition" value={transitionType ?? "—"} />
        <Row label="Transition State" value={transitionState} />
        <Row label="Transition Progress" value={transitionProgress.toFixed(3)} />
        <Row label="Performance" value={performanceTier} />
        <Row label="Motion Enabled" value={motionEnabled ? "✓" : "✗"} />
        <Row label="Reduced Motion" value={isReducedMotion ? "✓" : "✗"} />
        <Row
          label="Viewport"
          value={`${viewportWidth}×${viewportHeight}`}
        />
        <Row label="Active Scenes" value={activeScenes.length.toString()} />
        <Row
          label="Particles"
          value={profile.maxParticles.toString()}
        />
        <Row label="Post-Processing" value={profile.postProcessing ? "✓" : "✗"} />
        <Row label="Bloom" value={profile.useBloom ? "✓" : "✗"} />
        <Row
          label="Camera"
          value={
            cameraPreset
              ? `(${cameraPreset.position.x.toFixed(1)}, ${cameraPreset.position.y.toFixed(1)}, ${cameraPreset.position.z.toFixed(1)})`
              : "—"
          }
        />
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-[0.05em] text-[#525252]">
        {label}
      </span>
      <span
        className={`text-right ${
          highlight ? "text-[#EF4444]" : "text-[#A3A3A3]"
        }`}
      >
        {value}
      </span>
    </div>
  )
}
