"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const CAMERA_PRESETS = {
  ARRIVAL: { z: 16, y: 2.5, fov: 42 },
  OBSERVATORY: { z: 13, y: 2, fov: 38 },
  ARCHITECTURE: { z: 11, y: 1.5, fov: 36 },
  ENERGY: { z: 9, y: 1, fov: 34 },
  CHAMBER: { z: 7, y: 0.5, fov: 32 },
  REVELATION: { z: 6, y: 0.3, fov: 30 },
}

export function CivilizationCamera({
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

    const arrivalW = 1 - phaseValue(phase, PHASES.OBSERVATORY)
    const obsW = phaseValue(phase, PHASES.OBSERVATORY)
    const archW = phaseValue(phase, PHASES.ARCHITECTURE)
    const energyW = phaseValue(phase, PHASES.ENERGY)
    const chamberW = phaseValue(phase, PHASES.CHAMBER)
    const revelW = phaseValue(phase, PHASES.REVELATION)

    const zTarget =
      CAMERA_PRESETS.ARRIVAL.z * arrivalW +
      CAMERA_PRESETS.OBSERVATORY.z * (obsW - archW * 0.4) +
      CAMERA_PRESETS.ARCHITECTURE.z * (archW - energyW * 0.3) +
      CAMERA_PRESETS.ENERGY.z * (energyW - chamberW * 0.4) +
      CAMERA_PRESETS.CHAMBER.z * (chamberW - revelW * 0.5) +
      CAMERA_PRESETS.REVELATION.z * revelW

    const yTarget =
      CAMERA_PRESETS.ARRIVAL.y * arrivalW +
      CAMERA_PRESETS.OBSERVATORY.y * (obsW - archW * 0.3) +
      CAMERA_PRESETS.ARCHITECTURE.y * archW +
      CAMERA_PRESETS.ENERGY.y * (energyW - chamberW * 0.3) +
      CAMERA_PRESETS.CHAMBER.y * (chamberW - revelW * 0.3) +
      CAMERA_PRESETS.REVELATION.y * revelW

    const fovTarget =
      CAMERA_PRESETS.ARRIVAL.fov * arrivalW +
      CAMERA_PRESETS.OBSERVATORY.fov * (obsW - archW * 0.3) +
      CAMERA_PRESETS.ARCHITECTURE.fov * archW +
      CAMERA_PRESETS.ENERGY.fov * (energyW - chamberW * 0.3) +
      CAMERA_PRESETS.CHAMBER.fov * (chamberW - revelW * 0.3) +
      CAMERA_PRESETS.REVELATION.fov * revelW

    const driftX = Math.sin(t * 0.02) * 0.3 * (1 - revelW * 0.3)
    const driftY = Math.cos(t * 0.015) * 0.12
    const orbitX = Math.sin(t * 0.01) * archW * 0.6

    const smoothZ = THREE.MathUtils.damp(camera.position.z, zTarget, 4, delta)
    const smoothY = THREE.MathUtils.damp(camera.position.y, yTarget, 4, delta)
    const smoothFov = THREE.MathUtils.damp(camera.fov, fovTarget, 5, delta)

    camera.position.x = driftX + orbitX
    camera.position.y = smoothY + driftY
    camera.position.z = smoothZ
    camera.fov = smoothFov
    camera.updateProjectionMatrix()
    camera.lookAt(0, 0.2, 0)
  })
  /* eslint-enable react-hooks/immutability */

  return null
}
