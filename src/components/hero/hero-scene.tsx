"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import {
  AdaptiveDpr,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { HeroCamera } from "./hero-camera"
import { HeroCore } from "./hero-core"
import { HeroParticles } from "./hero-particles"
import { HeroLighting } from "./hero-lighting"

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 40, near: 0.1, far: 100 }}
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
      <fog attach="fog" args={["#050505", 20, 50]} />

      <Suspense fallback={null}>
        <PerformanceMonitor>
          <AdaptiveDpr pixelated />

          <HeroLighting />
          <HeroParticles />
          <HeroCore />
          <HeroCamera />

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              intensity={0.3}
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
