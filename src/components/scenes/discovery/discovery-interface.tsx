"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const RING_COUNT = 3
const MARKERS_PER_RING = 12
const TIMELINE_NODES = 7
const CORE_SEGMENTS = 2

function generateRings() {
  const configs = [
    { radius: 3, tiltX: 0, tiltZ: 0, color: "#D4A853" },
    { radius: 2.5, tiltX: Math.PI / 2, tiltZ: 0, color: "#8B5CF6" },
    { radius: 2, tiltX: Math.PI / 4, tiltZ: Math.PI / 3, color: "#22D3EE" },
  ]

  const markers: { pos: THREE.Vector3; color: string }[] = []
  for (let r = 0; r < RING_COUNT; r++) {
    const cfg = configs[r]
    for (let m = 0; m < MARKERS_PER_RING; m++) {
      const theta = (m / MARKERS_PER_RING) * Math.PI * 2
      const base = new THREE.Vector3(
        Math.cos(theta) * cfg.radius,
        0,
        Math.sin(theta) * cfg.radius
      )
      const euler = new THREE.Euler(cfg.tiltX, 0, cfg.tiltZ)
      base.applyEuler(euler)
      markers.push({ pos: base, color: cfg.color })
    }
  }

  const timelineNodes: { pos: THREE.Vector3; label: string }[] = []
  const timelineRadius = 4
  for (let i = 0; i < TIMELINE_NODES; i++) {
    const t = (i + 1) / (TIMELINE_NODES + 1)
    const theta = -Math.PI * 0.7 + t * Math.PI * 1.4
    timelineNodes.push({
      pos: new THREE.Vector3(
        Math.cos(theta) * timelineRadius,
        Math.sin(theta) * timelineRadius * 0.3,
        0
      ),
      label: `${i * 2} BYA`,
    })
  }

  const timelinePath: THREE.Vector3[] = []
  const steps = 50
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const theta = -Math.PI * 0.7 + t * Math.PI * 1.4
    timelinePath.push(
      new THREE.Vector3(
        Math.cos(theta) * timelineRadius,
        Math.sin(theta) * timelineRadius * 0.3,
        0
      )
    )
  }

  return { configs, markers, timelineNodes, timelinePath }
}

export function DiscoveryInterface({
  phaseRef,
}: {
  phaseRef: React.RefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(0)

  const { configs, markers, timelineNodes, timelinePath } = useMemo(
    () => generateRings(),
    []
  )

  const ringGeos = useMemo(
    () =>
      configs.map(
        (cfg) => new THREE.TorusGeometry(cfg.radius, 0.008, 32, 80)
      ),
    [configs]
  )

  const timelineCurve = useMemo(
    () => new THREE.CatmullRomCurve3(timelinePath),
    [timelinePath]
  )

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    const phase = phaseRef.current

    const holoOpacity = phaseValue(phase, PHASES.HOLOGRAM) *
      (1 - phaseValue(phase, { start: PHASES.REVEAL.start + 0.15, end: 1 }))
    const timelineOpacity = phaseValue(phase, PHASES.TIMELINES)
    const revealIntensity = phaseValue(phase, PHASES.REVEAL)

    groupRef.current.children.forEach((child) => {
      if (child.userData.isRing) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = holoOpacity * 0.4
        child.rotation.x += delta * 0.08
        child.rotation.z += delta * 0.05
      }
      if (child.userData.isMarker) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = holoOpacity * 0.6
      }
      if (child.userData.isTimeline) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = timelineOpacity * 0.35
      }
      if (child.userData.isNode) {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = timelineOpacity * 0.7
        const s = 0.04 + Math.sin(t * 2 + (child.userData.index ?? 0)) * 0.01
        child.scale.setScalar(s / 0.04)
      }
    })

    if (coreRef.current) {
      const coreOpacity =
        phaseValue(phase, PHASES.HOLOGRAM) * 0.5 +
        phaseValue(phase, PHASES.REVEAL) * 0.3
      const coreMat = coreRef.current.material as THREE.MeshBasicMaterial
      coreMat.opacity = Math.min(coreOpacity, 0.6)
      coreRef.current.rotation.x = t * 0.2
      coreRef.current.rotation.y = t * 0.3
      const coreS = 0.3 + Math.sin(t * 0.5) * 0.02 + revealIntensity * 0.1
      coreRef.current.scale.setScalar(coreS / 0.3)
    }
  })

  return (
    <group ref={groupRef}>
      {ringGeos.map((geo, i) => (
        <mesh
          key={`ring-${i}`}
          geometry={geo}
          userData={{ isRing: true, index: i }}
        >
          <meshBasicMaterial
            color={configs[i].color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {markers.map((m, i) => (
        <mesh
          key={`marker-${i}`}
          position={m.pos}
          userData={{ isMarker: true }}
        >
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial
            color={m.color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh
        geometry={new THREE.TubeGeometry(timelineCurve, 50, 0.01, 4, false)}
        userData={{ isTimeline: true }}
      >
        <meshBasicMaterial
          color="#D4A853"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {timelineNodes.map((node, i) => (
        <mesh
          key={`node-${i}`}
          position={node.pos}
          userData={{ isNode: true, index: i }}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial
            color="#F5A623"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.3, CORE_SEGMENTS]} />
        <meshBasicMaterial
          color="#D4A853"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
