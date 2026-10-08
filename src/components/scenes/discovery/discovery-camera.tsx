"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const CAMERA_PRESETS = {
  STABILIZE: { z: 10, y: 0, fov: 38 },
  PATHWAYS: { z: 9, y: 0.3, fov: 36 },
  HOLOGRAM: { z: 8, y: 0.5, fov: 34 },
  TIMELINES: { z: 8.5, y: 0.2, fov: 36 },
  REVEAL: { z: 7, y: 0, fov: 32 },
}

export function DiscoveryCamera({
  phaseRef,
}: {
  phaseRef: React.RefObject<number>
}) {
  const camera = useThree(
    (s) => s.camera as THREE.PerspectiveCamera
  )
  const timeRef = useRef(0)

  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    const phase = phaseRef.current

    const stabW = 1 - phaseValue(phase, PHASES.PATHWAYS)
    const pathwayW = phaseValue(phase, PHASES.PATHWAYS)
    const holoW = phaseValue(phase, PHASES.HOLOGRAM)
    const timeW = phaseValue(phase, PHASES.TIMELINES)
    const revealW = phaseValue(phase, PHASES.REVEAL)

    const zTarget =
      CAMERA_PRESETS.STABILIZE.z * stabW +
      CAMERA_PRESETS.PATHWAYS.z * (pathwayW - holoW * 0.5) +
      CAMERA_PRESETS.HOLOGRAM.z * (holoW - timeW * 0.3) +
      CAMERA_PRESETS.TIMELINES.z * (timeW - revealW * 0.5) +
      CAMERA_PRESETS.REVEAL.z * revealW

    const yTarget =
      CAMERA_PRESETS.STABILIZE.y * stabW +
      CAMERA_PRESETS.PATHWAYS.y * pathwayW +
      CAMERA_PRESETS.HOLOGRAM.y * (holoW - timeW * 0.3) +
      CAMERA_PRESETS.TIMELINES.y * timeW +
      CAMERA_PRESETS.REVEAL.y * revealW

    const fovTarget =
      CAMERA_PRESETS.STABILIZE.fov * stabW +
      CAMERA_PRESETS.PATHWAYS.fov * pathwayW +
      CAMERA_PRESETS.HOLOGRAM.fov * (holoW - timeW * 0.3) +
      CAMERA_PRESETS.TIMELINES.fov * timeW +
      CAMERA_PRESETS.REVEAL.fov * revealW

    const driftX = Math.sin(t * 0.03) * 0.15 * (1 - revealW * 0.5)
    const driftY = Math.cos(t * 0.02) * 0.08
    const orbitX = Math.sin(t * 0.02) * holoW * 0.8

    const smoothZ = THREE.MathUtils.damp(camera.position.z, zTarget, 3, delta)
    const smoothY = THREE.MathUtils.damp(camera.position.y, yTarget, 3, delta)
    const smoothFov = THREE.MathUtils.damp(
      camera.fov,
      fovTarget + Math.sin(t * 0.2) * 0.2,
      4,
      delta
    )

    camera.position.x = driftX + orbitX
    camera.position.y = smoothY + driftY
    camera.position.z = smoothZ
    camera.fov = smoothFov
    camera.updateProjectionMatrix()
    camera.lookAt(0, 0, 0)
  })
  /* eslint-enable react-hooks/immutability */

  return null
}
