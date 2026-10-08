"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue } from "./phases"

const STRUCTURE_COUNT = 15

interface StructureInstance {
  pos: [number, number, number]
  rot: [number, number, number]
  scale: number
  type: "octa" | "ico" | "box"
  phase: number
}

export function GenesisStructures({
  phaseRef,
}: {
  phaseRef: React.RefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  const octaGeo = useMemo(() => new THREE.OctahedronGeometry(0.4, 0), [])
  const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(0.4, 0), [])
  const boxGeo = useMemo(() => new THREE.BoxGeometry(0.5, 0.5, 0.5), [])

  /* eslint-disable react-hooks/purity */
  const structures = useMemo(() => {
    const data: StructureInstance[] = []
    for (let i = 0; i < STRUCTURE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 5
      data.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          (Math.random() - 0.5) * 2,
          r * Math.cos(phi),
        ],
        rot: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.2 + Math.random() * 0.6,
        type: (["octa", "ico", "box"] as const)[Math.floor(Math.random() * 3)],
        phase: 0.8 + Math.random() * 0.15,
      })
    }
    return data
  }, [])
  /* eslint-enable react-hooks/purity */

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    const phase = phaseRef.current

    groupRef.current.children.forEach((child, i) => {
      const s = structures[i]
      if (!s) return
      const appear = phaseValue(phase, {
        start: s.phase,
        end: s.phase + 0.1,
      })
      const finalScale = s.scale * appear
      child.scale.setScalar(finalScale)

      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      mat.opacity = appear

      child.rotation.x = s.rot[0] + t * 0.05
      child.rotation.y = s.rot[1] + t * 0.08
      child.rotation.z = s.rot[2] + t * 0.03

      const floatY = Math.sin(t * 0.5 + i) * 0.03 * appear
      child.position.y = s.pos[1] + floatY
    })
  })

  return (
    <group ref={groupRef}>
      {structures.map((s, i) => {
        const geo =
          s.type === "octa"
            ? octaGeo
            : s.type === "ico"
              ? icoGeo
              : boxGeo
        return (
          <mesh
            key={i}
            geometry={geo}
            position={s.pos}
            rotation={s.rot}
            scale={0}
          >
            <meshStandardMaterial
              color="#2A2A2A"
              roughness={0.3}
              metalness={0.8}
              transparent
              opacity={0}
              envMapIntensity={0.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}
