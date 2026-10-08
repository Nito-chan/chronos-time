"use client"

import { useRef, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { GenesisCamera } from "./genesis-camera"
import { GenesisStars } from "./genesis-stars"
import { GenesisParticles } from "./genesis-particles"
import { GenesisEnergy } from "./genesis-energy"
import { GenesisStructures } from "./genesis-structures"
import { phaseValue, PHASES } from "./phases"

export function GenesisCanvas({
  phase,
  mouseX = 0,
  mouseY = 0,
}: {
  phase: number
  mouseX?: number
  mouseY?: number
}) {
  const phaseRef = useRef(phase)
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 40, near: 0.1, far: 100 }}
      dpr={[0.5, 1.5]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
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
      <color
        attach="background"
        args={[
          phaseValue(phase, PHASES.COSMIC) > 0.1 ? "#050510" : "#050505",
        ]}
      />
      <fog
        attach="fog"
        args={["#050505", Math.max(20, 50 - phase * 20), 50]}
      />

      <Suspense fallback={null}>
        <PerformanceMonitor>
          <AdaptiveDpr pixelated />

          <GenesisCamera phaseRef={phaseRef} />
          <ambientLight
            intensity={0.1 + phaseValue(phase, PHASES.COSMIC) * 0.2}
            color="#1A1A3E"
          />
          <GenesisStars phaseRef={phaseRef} />
          <GenesisParticles
            phaseRef={phaseRef}
            mouseX={mouseX}
            mouseY={mouseY}
          />
          <GenesisEnergy phaseRef={phaseRef} />
          <GenesisStructures phaseRef={phaseRef} />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              intensity={0.2 + phaseValue(phase, PHASES.ENERGY) * 0.2}
              radius={0.5}
              mipmapBlur
            />
          </EffectComposer>

          <Preload all />
        </PerformanceMonitor>
      </Suspense>
    </Canvas>
  )
}
