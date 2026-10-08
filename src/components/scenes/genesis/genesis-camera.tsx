"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const CAMERA_PRESETS = {
  VOID: { z: 12, y: 0, fov: 40 },
  ENERGY: { z: 10, y: 0.5, fov: 42 },
  COSMIC: { z: 12, y: 0, fov: 38 },
  TIME: { z: 14, y: 0.3, fov: 40 },
  STRUCTURE: { z: 10, y: 0.2, fov: 36 },
}

export function GenesisCamera({
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

    const voidW = 1 - phaseValue(phase, PHASES.ENERGY)
    const energyW = phaseValue(phase, PHASES.ENERGY)
    const cosmicW = phaseValue(phase, PHASES.COSMIC)
    const timeW = phaseValue(phase, PHASES.TIME)
    const structW = phaseValue(phase, PHASES.STRUCTURE)

    const zTarget =
      CAMERA_PRESETS.VOID.z * voidW +
      CAMERA_PRESETS.ENERGY.z * (energyW - cosmicW * 0.5) +
      CAMERA_PRESETS.COSMIC.z * (cosmicW - energyW * 0.3) +
      CAMERA_PRESETS.TIME.z * (timeW - structW * 0.5) +
      CAMERA_PRESETS.STRUCTURE.z * structW

    const yTarget =
      CAMERA_PRESETS.VOID.y * voidW +
      CAMERA_PRESETS.ENERGY.y * energyW +
      CAMERA_PRESETS.COSMIC.y * (cosmicW - timeW * 0.3) +
      CAMERA_PRESETS.TIME.y * timeW +
      CAMERA_PRESETS.STRUCTURE.y * structW

    const fovTarget =
      CAMERA_PRESETS.VOID.fov * voidW +
      CAMERA_PRESETS.ENERGY.fov * energyW +
      CAMERA_PRESETS.COSMIC.fov * (cosmicW - timeW * 0.3) +
      CAMERA_PRESETS.TIME.fov * timeW +
      CAMERA_PRESETS.STRUCTURE.fov * structW

    const driftX = Math.sin(t * 0.06) * 0.2 * (1 - structW * 0.5)
    const driftY = Math.cos(t * 0.04) * 0.1
    const orbitX = Math.sin(t * 0.03) * cosmicW * 1.5

    const smoothZ = THREE.MathUtils.damp(camera.position.z, zTarget, 2, delta)
    const smoothY = THREE.MathUtils.damp(camera.position.y, yTarget, 2, delta)
    const smoothFov = THREE.MathUtils.damp(
      camera.fov,
      fovTarget + Math.sin(t * 0.3) * 0.3,
      3,
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
