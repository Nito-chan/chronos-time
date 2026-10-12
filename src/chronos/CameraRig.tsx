"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useChronosStore } from "./store"

// Seven breaths — one continuous dolly. Scroll = descent into time.
const WAYPOINTS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0, 0.6, 15], look: [0, 0, 0] }, // void — far, small core
  { pos: [0, 0.3, 10.5], look: [0, 0, 0] }, // genesis — approach
  { pos: [-4.2, 1.2, 8.5], look: [0, 0, 0] }, // memory — orbit left
  { pos: [3.6, -0.8, 7.2], look: [0, 0, 0] }, // fracture — low right, tense
  { pos: [0, 1.8, 8.0], look: [0, 0.2, 0] }, // signal — rise above
  { pos: [0, 0, 6.2], look: [0, 0, 0] }, // synthesis — intimate
  { pos: [0, 0.4, 11], look: [0, 0, 0] }, // instrument — pull back wide
]

function catmull(positions: THREE.Vector3[], t: number) {
  const n = positions.length - 1
  const f = t * n
  const i = Math.min(Math.floor(f), n - 1)
  const u = f - i
  const a = positions[i]!
  const b = positions[i + 1]!
  return new THREE.Vector3().lerpVectors(a, b, u * u * (3 - 2 * u))
}

export function CameraRig() {
  const ref = useRef<THREE.PerspectiveCamera>(null!)
  const smooth = useRef(0)
  const posPts = useRef(WAYPOINTS.map((w) => new THREE.Vector3(...w.pos)))
  const lookPts = useRef(WAYPOINTS.map((w) => new THREE.Vector3(...w.look)))

  useFrame((state, delta) => {
    const { progress, mouseX, mouseY, reducedMotion } = useChronosStore.getState()
    smooth.current += (progress - smooth.current) * Math.min(1, delta * 2.2)
    const p = THREE.MathUtils.clamp(smooth.current, 0, 1)
    const pos = catmull(posPts.current, p)
    const look = catmull(lookPts.current, p)
    if (!reducedMotion) {
      pos.x += mouseX * 0.35
      pos.y += mouseY * 0.25
    }
    ref.current.position.lerp(pos, 0.08)
    const target = look.clone()
    ref.current.lookAt(target)
    // subtle handheld drift — never mechanical
    if (!reducedMotion) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.3) * 0.0008
    }
  })

  return <perspectiveCamera ref={ref} args={[35, 1, 0.1, 100]} />
}
