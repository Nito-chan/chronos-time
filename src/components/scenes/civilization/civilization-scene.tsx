"use client"

import { useRef, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { CivilizationCamera } from "./civilization-camera"
import { CivilizationStructures } from "./civilization-structures"
import { CivilizationEnvironment } from "./civilization-environment"
import { phaseValue, PHASES } from "./phases"

export function CivilizationCanvas({
  phase,
}: {
  phase: number
}) {
  const phaseRef = useRef(phase)
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  return (
    <Canvas
      camera={{ position: [0, 2.5, 16], fov: 42, near: 0.1, far: 100 }}
      dpr={[0.5, 1.5]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    >
      <color attach="background" args={["#030308"]} />
      <fog
        attach="fog"
        args={["#030308", 12, 30]}
      />

      <Suspense fallback={null}>
        <PerformanceMonitor>
          <AdaptiveDpr pixelated />

          <CivilizationCamera phaseRef={phaseRef} />
          <ambientLight
            intensity={0.08 + phaseValue(phase, PHASES.CHAMBER) * 0.12}
            color="#3A2A1A"
          />
          <CivilizationStructures phaseRef={phaseRef} />
          <CivilizationEnvironment phaseRef={phaseRef} />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.4}
              luminanceSmoothing={0.8}
              intensity={0.2 + phaseValue(phase, PHASES.ENERGY) * 0.2 + phaseValue(phase, PHASES.CHAMBER) * 0.1}
              radius={0.7}
              mipmapBlur
            />
          </EffectComposer>

          <Preload all />
        </PerformanceMonitor>
      </Suspense>
    </Canvas>
  )
}
