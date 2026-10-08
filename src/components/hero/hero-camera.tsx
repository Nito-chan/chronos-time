"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useHeroStore } from "./hero-store"

export function HeroCamera() {
  const mouseX = useHeroStore((s) => s.mouseX)
  const mouseY = useHeroStore((s) => s.mouseY)
  const scrollProgress = useHeroStore((s) => s.scrollProgress)
  const timeRef = useRef(0)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const baseZ = 14

  useFrame((state, delta) => {
    if (!cameraRef.current) {
      cameraRef.current = state.camera as THREE.PerspectiveCamera
    }
    const cam = cameraRef.current
    timeRef.current += delta
    const t = timeRef.current

    const breath = Math.sin(t * 0.4) * 0.4
    cam.fov = 40 + breath
    cam.updateProjectionMatrix()

    const driftX = Math.sin(t * 0.08) * 0.25
    const driftY = Math.cos(t * 0.06) * 0.15
    const driftZ = Math.sin(t * 0.1) * 0.1

    const parallaxX = mouseX * 0.08
    const parallaxY = mouseY * 0.08

    const scrollDolly = scrollProgress * 6
    const scrollSwayX = Math.sin(t * 0.15) * scrollProgress * 0.3

    cam.position.x = driftX + parallaxX + scrollSwayX
    cam.position.y = driftY + parallaxY
    cam.position.z = baseZ + driftZ - scrollDolly

    cam.lookAt(0, 0, 0)
  })

  return null
}
