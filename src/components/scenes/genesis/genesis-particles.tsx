"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const DUST_COUNT_BASE = 400
const SPARKLE_COUNT = 200

export function GenesisParticles({
  phaseRef,
  mouseX,
  mouseY,
}: {
  phaseRef: React.RefObject<number>
  mouseX: number
  mouseY: number
}) {
  const dustRef = useRef<THREE.Points>(null!)
  const sparkleRef = useRef<THREE.Points>(null!)
  const timeRef = useRef(0)
  const velocities = useRef<Float32Array | null>(null)

  /* eslint-disable react-hooks/purity */
  const dustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(DUST_COUNT_BASE * 3)
    const sizes = new Float32Array(DUST_COUNT_BASE)
    const vel = new Float32Array(DUST_COUNT_BASE * 3)
    for (let i = 0; i < DUST_COUNT_BASE; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2 + Math.random() * 10
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = 0.008 + Math.random() * 0.015
      vel[i * 3] = (Math.random() - 0.5) * 0.1
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.05
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.1
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    // eslint-disable-next-line react-hooks/refs
    velocities.current = vel
    return geo
  }, [])
  /* eslint-enable react-hooks/purity */

  /* eslint-disable react-hooks/purity */
  const sparkleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(SPARKLE_COUNT * 3)
    const sizes = new Float32Array(SPARKLE_COUNT)
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 3 + Math.random() * 6
      positions[i * 3] = r * Math.cos(theta)
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3
      positions[i * 3 + 2] = r * Math.sin(theta)
      sizes[i] = 0.02 + Math.random() * 0.04
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [])
  /* eslint-enable react-hooks/purity */

  const dustMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#22D3EE",
        size: 0.012,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  )

  const sparkleMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#D4A853",
        size: 0.03,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  )

  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    const phase = phaseRef.current

    const dustOpacity = Math.min(
      phaseValue(phase, PHASES.VOID) * 0.5 +
        phaseValue(phase, PHASES.ENERGY) * 0.3 +
        phaseValue(phase, { start: PHASES.COSMIC.start, end: 1 }) * 0.2,
      0.6
    )
    dustMat.opacity = dustOpacity

    const energyBoost = phaseValue(phase, { start: PHASES.ENERGY.start + 0.05, end: PHASES.ENERGY.end })
    const timeBoost = phaseValue(phase, { start: PHASES.TIME.start, end: PHASES.TIME.end })
    const spiralIntensity = energyBoost + timeBoost

    const pos = dustRef.current.geometry.attributes.position
    const vel = velocities.current!
    for (let i = 0; i < DUST_COUNT_BASE; i++) {
      const i3 = i * 3
      let x = pos.getX(i)
      let y = pos.getY(i)
      let z = pos.getZ(i)

      const dist = Math.sqrt(x * x + y * y + z * z)

      const orbitSpeed = spiralIntensity * 0.3 * (1 / Math.max(dist, 1))
      const angle = Math.atan2(z, x)
      const newAngle = angle + orbitSpeed * delta

      const xOrbit = dist * Math.cos(newAngle) * Math.cos(Math.atan2(y, Math.sqrt(x * x + z * z)))
      const zOrbit = dist * Math.sin(newAngle) * Math.cos(Math.atan2(y, Math.sqrt(x * x + z * z)))

      const orbitBlend = Math.min(spiralIntensity * 3, 1)
      x = x * (1 - orbitBlend) + xOrbit * orbitBlend
      z = z * (1 - orbitBlend) + zOrbit * orbitBlend

      x += vel[i3] * delta * (1 + spiralIntensity)
      y += vel[i3 + 1] * delta
      z += vel[i3 + 2] * delta * (1 + spiralIntensity)

      const maxR = 12
      if (dist > maxR) {
        vel[i3] -= x * 0.001
        vel[i3 + 2] -= z * 0.001
      }

      if (spiralIntensity > 0.1) {
        const mouseInfl = spiralIntensity * 0.02
        x += mouseX * mouseInfl * (1 / Math.max(dist, 1))
        y += mouseY * mouseInfl * (1 / Math.max(dist, 1))
      }

      pos.setXYZ(i, x, y, z)
    }
    pos.needsUpdate = true

    const colorBlend = phaseValue(phase, { start: PHASES.TIME.start, end: PHASES.TIME.end })
    if (colorBlend > 0) {
      const c = new THREE.Color("#22D3EE").lerp(
        new THREE.Color("#D4A853"),
        colorBlend
      )
      dustMat.color.copy(c)
    }

    dustMat.size = 0.012 + spiralIntensity * 0.008

    dustRef.current.rotation.y = t * 0.01 * (1 + spiralIntensity)

    sparkleMat.opacity = phaseValue(phase, { start: PHASES.TIME.start, end: PHASES.TIME.end }) * 0.3
    sparkleRef.current.rotation.y = t * 0.02
  })
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <points ref={dustRef} geometry={dustGeo} material={dustMat} />
      <points ref={sparkleRef} geometry={sparkleGeo} material={sparkleMat} />
    </>
  )
}
