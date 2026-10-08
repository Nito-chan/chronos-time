"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const RIVER_COUNT = 5
const CRYSTAL_COUNT = 14
const DEBRIS_COUNT = 30

function generateRivers() {
  const data: { points: THREE.Vector3[]; color: string }[] = []
  for (let r = 0; r < RIVER_COUNT; r++) {
    const angle = (r / RIVER_COUNT) * Math.PI * 2
    const startR = 8 + Math.random() * 3
    const pts: THREE.Vector3[] = []
    const count = 5 + Math.floor(Math.random() * 3)
    for (let i = 0; i <= count; i++) {
      const t = i / count
      const dist = startR * (1 - t * 0.85)
      const spread = (1 - t) * 1.5
      pts.push(
        new THREE.Vector3(
          Math.cos(angle + t * 0.8 + (Math.random() - 0.5) * 0.3) * dist + (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * 0.05,
          Math.sin(angle + t * 0.8 + (Math.random() - 0.5) * 0.3) * dist + (Math.random() - 0.5) * spread
        )
      )
    }
    data.push({
      points: pts,
      color: ["#F5A623", "#D4A853", "#E8962E"][r % 3],
    })
  }
  return data
}

function generateCrystals() {
  const data: { pos: THREE.Vector3; scaleY: number; color: string }[] = []
  for (let i = 0; i < CRYSTAL_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2
    const r = 3 + Math.random() * 6
    data.push({
      pos: new THREE.Vector3(
        Math.cos(theta) * r,
        0,
        Math.sin(theta) * r
      ),
      scaleY: 1.5 + Math.random() * 2.5,
      color: i % 3 === 0 ? "#22D3EE" : i % 3 === 1 ? "#5BC0BE" : "#D4A853",
    })
  }
  return data
}

function generateDebris() {
  const data: {
    pos: THREE.Vector3; rot: THREE.Euler; scale: number; speed: number
  }[] = []
  for (let i = 0; i < DEBRIS_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2
    const r = 1 + Math.random() * 8
    data.push({
      pos: new THREE.Vector3(
        Math.cos(theta) * r,
        0.5 + Math.random() * 3.5,
        Math.sin(theta) * r
      ),
      rot: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      scale: 0.03 + Math.random() * 0.08,
      speed: 0.1 + Math.random() * 0.2,
    })
  }
  return data
}

export function CivilizationEnvironment({
  phaseRef,
}: {
  phaseRef: React.RefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  const rivers = useMemo(() => generateRivers(), [])
  const crystals = useMemo(() => generateCrystals(), [])
  const debris = useMemo(() => generateDebris(), [])

  const riverCurves = useMemo(
    () => rivers.map((r) => new THREE.CatmullRomCurve3(r.points)),
    [rivers]
  )

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    const phase = phaseRef.current

    const energyOpacity = phaseValue(phase, PHASES.ENERGY) *
      (1 - phaseValue(phase, { start: PHASES.REVELATION.start + 0.1, end: 1 }))
    const crystalOpacity = phaseValue(phase, PHASES.ENERGY)
    const debrisOpacity = phaseValue(phase, PHASES.REVELATION)

    groupRef.current.children.forEach((child) => {
      if (child.userData.isRiver) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = energyOpacity * 0.4
      }
      if (child.userData.isCrystal) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        const pulse = 0.5 + Math.sin(t * 0.6 + (child.userData.index ?? 0) * 0.5) * 0.3 + crystalOpacity * 0.2
        mat.opacity = Math.min(crystalOpacity * pulse * 0.6, 0.5)
        const s = 1 + Math.sin(t * 0.5 + (child.userData.index ?? 0)) * 0.02
        child.scale.setScalar(s)
      }
      if (child.userData.isDebris) {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        mat.opacity = debrisOpacity * 0.15
        const drift = Math.sin(t * child.userData.speed + (child.userData.index ?? 0)) * 0.02
        child.position.y += drift * delta
        child.rotation.x += delta * child.userData.speed * 0.1
        child.rotation.y += delta * child.userData.speed * 0.15
      }
    })
  })

  return (
    <group ref={groupRef}>
      {riverCurves.map((curve, i) => {
        const geo = new THREE.TubeGeometry(curve, 30, 0.006, 3, false)
        return (
          <mesh
            key={`river-${i}`}
            geometry={geo}
            userData={{ isRiver: true }}
          >
            <meshBasicMaterial
              color={rivers[i].color}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )
      })}

      {crystals.map((c, i) => (
        <mesh
          key={`crystal-${i}`}
          position={c.pos}
          scale={[1, c.scaleY, 1]}
          userData={{ isCrystal: true, index: i }}
        >
          <icosahedronGeometry args={[0.12, 1]} />
          <meshBasicMaterial
            color={c.color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {debris.map((d, i) => (
        <mesh
          key={`debris-${i}`}
          position={d.pos}
          rotation={d.rot}
          userData={{
            isDebris: true,
            index: i,
            speed: d.speed,
            baseY: d.pos.y,
          }}
        >
          <octahedronGeometry args={[d.scale, 0]} />
          <meshStandardMaterial
            color="#5A4A3A"
            roughness={0.8}
            metalness={0.1}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  )
}
