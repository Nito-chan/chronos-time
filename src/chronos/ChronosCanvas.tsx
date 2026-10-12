"use client"

import { Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { ChronosCore } from "./ChronosCore"
import { CameraRig } from "./CameraRig"
import { useChronosStore } from "./store"

function Lighting() {
  return (
    <>
      {/* key — morning sun through high window, 45° up-left */}
      <directionalLight position={[-5, 6, 4]} intensity={1.6} color="#FFF4E0" />
      {/* rim — sharp cyan edge from behind-right */}
      <directionalLight position={[6, 2, -5]} intensity={1.1} color="#22D3EE" />
      {/* fill — violet bounce from below */}
      <pointLight position={[0, -4, 2]} intensity={4} color="#8B5CF6" distance={14} />
      <ambientLight intensity={0.12} color="#0A0A0A" />
    </>
  )
}

function FogRig() {
  return <fog attach="fog" args={["#050505", 8, 26]} />
}

export function ChronosCanvas() {
  const reduced = useChronosStore((s) => s.reducedMotion)
  const dpr = useMemo((): [number, number] => {
    if (typeof window === "undefined") return [1, 1.5]
    return window.innerWidth < 768 ? [0.75, 1.25] : [1, 1.75]
  }, [])

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 35, position: [0, 0.6, 15], near: 0.1, far: 100 }}
      style={{ background: "#050505" }}
    >
      <color attach="background" args={["#050505"]} />
      <FogRig />
      <Lighting />
      <Suspense fallback={null}>
        <ChronosCore />
      </Suspense>
      <CameraRig />
      {!reduced && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.72}
            luminanceSmoothing={0.2}
            radius={0.8}
          />
          <Vignette eskil={false} offset={0.22} darkness={0.78} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
