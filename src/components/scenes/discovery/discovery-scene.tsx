"use client"

import { useRef, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { DiscoveryCamera } from "./discovery-camera"
import { DiscoveryPathways } from "./discovery-pathways"
import { DiscoveryInterface } from "./discovery-interface"
import { phaseValue, PHASES } from "./phases"

export function DiscoveryCanvas({
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
      camera={{ position: [0, 0, 10], fov: 38, near: 0.1, far: 100 }}
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
      <color attach="background" args={["#050505"]} />
      <fog
        attach="fog"
        args={["#050505", 15, 40]}
      />

      <Suspense fallback={null}>
        <PerformanceMonitor>
          <AdaptiveDpr pixelated />

          <DiscoveryCamera phaseRef={phaseRef} />
          <ambientLight
            intensity={0.05 + phaseValue(phase, PHASES.HOLOGRAM) * 0.1}
            color="#1A1A3E"
          />
          <DiscoveryPathways phaseRef={phaseRef} />
          <DiscoveryInterface phaseRef={phaseRef} />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.3}
              luminanceSmoothing={0.85}
              intensity={0.3 + phaseValue(phase, PHASES.HOLOGRAM) * 0.15}
              radius={0.6}
              mipmapBlur
            />
          </EffectComposer>

          <Preload all />
        </PerformanceMonitor>
      </Suspense>
    </Canvas>
  )
}
