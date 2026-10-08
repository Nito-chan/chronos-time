"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const POINT_COUNT = 25
const CONNECTIONS_PER_POINT = 2
const SPHERE_RADIUS = 7

function generatePathways() {
  const points: THREE.Vector3[] = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 3 + Math.random() * (SPHERE_RADIUS - 3)
    points.push(
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.6,
        r * Math.cos(phi)
      )
    )
  }

  const connections: [number, number][] = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const dists = points
      .map((p, j) => ({ idx: j, dist: points[i].distanceTo(p) }))
      .filter((d) => d.idx !== i)
      .sort((a, b) => a.dist - b.dist)

    for (let k = 0; k < CONNECTIONS_PER_POINT; k++) {
      if (k < dists.length) {
        const edge: [number, number] = [i, dists[k].idx]
        const exists = connections.some(
          ([a, b]) =>
            (a === edge[0] && b === edge[1]) ||
            (a === edge[1] && b === edge[0])
        )
        if (!exists) connections.push(edge)
      }
    }
  }

  return { points, connections }
}

export function DiscoveryPathways({
  phaseRef,
}: {
  phaseRef: React.RefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  const { points, connections } = useMemo(() => generatePathways(), [])

  /* eslint-disable react-hooks/purity */
  const curveData = useMemo(() => {
    return connections.map(([i, j]) => {
      const mid = points[i].clone().lerp(points[j], 0.5)
      const perp = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      )
      mid.add(perp)
      return { a: points[i], b: points[j], mid }
    })
  }, [points, connections])
  /* eslint-enable react-hooks/purity */

  useFrame((_, delta) => {
    timeRef.current += delta
    const phase = phaseRef.current
    const opacity = phaseValue(phase, PHASES.PATHWAYS) *
      (1 - phaseValue(phase, { start: PHASES.REVEAL.start + 0.1, end: 1 }))

    groupRef.current.children.forEach((child) => {
      if (child.userData.isCurve) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = opacity * 0.3
      }
      if (child.userData.isNode) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = opacity * 0.5
      }
    })

    groupRef.current.rotation.y = timeRef.current * 0.005 * opacity
  })

  return (
    <group ref={groupRef}>
      {curveData.map((curve, i) => {
        const pts = [
          curve.a,
          curve.mid.clone().lerp(curve.a, 0.3),
          curve.mid.clone().lerp(curve.b, 0.3),
          curve.b,
        ]
        const c = new THREE.CatmullRomCurve3(pts)
        const geo = new THREE.TubeGeometry(c, 20, 0.004, 3, false)
        return (
          <mesh key={`curve-${i}`} geometry={geo} userData={{ isCurve: true }}>
            <meshBasicMaterial
              color="#22D3EE"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )
      })}

      {points.map((p, i) => (
        <mesh
          key={`node-${i}`}
          position={p}
          userData={{ isNode: true }}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial
            color="#22D3EE"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
