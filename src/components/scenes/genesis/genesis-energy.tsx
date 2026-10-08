"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, phaseRange, PHASES } from "./phases"

function EnergyPulse({ phaseRef }: { phaseRef: React.RefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(0)

  const ringGeo = useMemo(() => new THREE.RingGeometry(0.01, 0.05, 48), [])

  const pulseMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#22D3EE",
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    []
  )

  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    timeRef.current += delta
    const phase = phaseRef.current
    const p = phaseRange(phase, PHASES.ENERGY)

    if (p > 0 && p < 1) {
      const pulsePos = (timeRef.current * 0.3) % 1
      const scale = 1 + pulsePos * 12
      const opacity = (1 - pulsePos) * 0.3 * p

      meshRef.current.scale.setScalar(scale)
      pulseMat.opacity = opacity
      meshRef.current.rotation.x = Math.sin(timeRef.current * 0.5) * 0.1
      meshRef.current.rotation.z = Math.cos(timeRef.current * 0.3) * 0.1

      if (ringRef.current) {
        const ringScale = 1 + ((pulsePos + 0.3) % 1) * 10
        const ringOpacity = (1 - ((pulsePos + 0.3) % 1)) * 0.15 * p
        ringRef.current.scale.setScalar(ringScale)
        ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity =
          ringOpacity
      }
    } else if (p >= 1) {
      const fade = phaseValue(phaseRef.current, {
        start: PHASES.ENERGY.end,
        end: PHASES.ENERGY.end + 0.1,
      })
      pulseMat.opacity = 0.1 * (1 - fade)
    }
  })
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <mesh ref={meshRef} geometry={ringGeo} material={pulseMat} />
      <mesh ref={ringRef} geometry={ringGeo}>
        <meshBasicMaterial
          color="#8B5CF6"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

function EnergyStreams({ phaseRef }: { phaseRef: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  const streamData = useMemo(() => {
    const data: { points: THREE.Vector3[]; color: string }[] = []
    const colors = ["#22D3EE", "#8B5CF6", "#D4A853"]
    for (let s = 0; s < 5; s++) {
      const pts: THREE.Vector3[] = []
      const startAngle = (s / 5) * Math.PI * 2
      for (let i = 0; i <= 30; i++) {
        const progress = i / 30
        const angle = startAngle + progress * Math.PI * 3
        const r = 1 + progress * 7 * (0.8 + Math.sin(s * 2.5) * 0.3)
        const x = r * Math.cos(angle)
        const z = r * Math.sin(angle)
        const y = Math.sin(progress * Math.PI * 4 + s) * 0.5 * (1 - progress * 0.3)
        pts.push(new THREE.Vector3(x, y, z))
      }
      data.push({ points: pts, color: colors[s % colors.length] })
    }
    return data
  }, [])

  useFrame((_, delta) => {
    timeRef.current += delta
    const phase = phaseRef.current
    const opacity = phaseValue(phase, { start: PHASES.TIME.start, end: PHASES.TIME.end })
    const exitFade = 1 - phaseValue(phase, { start: PHASES.STRUCTURE.start + 0.1, end: 1 })

    groupRef.current.children.forEach((child) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
      mat.opacity = opacity * 0.15 * exitFade
    })
    groupRef.current.rotation.y = timeRef.current * 0.02
    groupRef.current.rotation.x = Math.sin(timeRef.current * 0.01) * 0.03
  })

  return (
    <group ref={groupRef}>
      {streamData.map((stream, i) => {
        const curve = new THREE.CatmullRomCurve3(stream.points)
        const geo = new THREE.TubeGeometry(curve, 50, 0.015, 4, false)
        return (
          <mesh key={i} geometry={geo}>
            <meshBasicMaterial
              color={stream.color}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function GenesisEnergy({
  phaseRef,
}: {
  phaseRef: React.RefObject<number>
}) {
  return (
    <>
      <EnergyPulse phaseRef={phaseRef} />
      <EnergyStreams phaseRef={phaseRef} />
    </>
  )
}
