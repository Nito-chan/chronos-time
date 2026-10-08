"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const OBSERVATORY_RINGS = [
  { radius: 5, tube: 0.025, y: 0, tiltX: 0, color: "#8B7355" },
  { radius: 6, tube: 0.02, y: 0.6, tiltX: 0.08, color: "#6B5B45" },
  { radius: 7, tube: 0.015, y: 1.3, tiltX: -0.05, color: "#8B7355" },
  { radius: 8, tube: 0.01, y: 2.0, tiltX: 0.12, color: "#D4A853" },
  { radius: 4, tube: 0.03, y: -0.3, tiltX: -0.03, color: "#6B5B45" },
]

const CHAMBER_RINGS = [
  { radius: 4.5, tube: 0.03, y: -0.1, color: "#D4A853" },
  { radius: 3.5, tube: 0.025, y: 0.15, color: "#8B7355" },
  { radius: 2.5, tube: 0.02, y: 0.35, color: "#D4A853" },
  { radius: 1.5, tube: 0.015, y: 0.5, color: "#F5A623" },
]

const PILLAR_COUNT = 8
const PILLAR_RADIUS = 9.5

type PillarData = { pos: THREE.Vector3; scaleY: number; rot: number }
type PlatformData = {
  pos: THREE.Vector3; size: [number, number, number]
  rotY: number; rotX: number
}

function generatePillars(): PillarData[] {
  const data: PillarData[] = []
  for (let i = 0; i < PILLAR_COUNT; i++) {
    const theta = (i / PILLAR_COUNT) * Math.PI * 2
    data.push({
      pos: new THREE.Vector3(
        Math.cos(theta) * PILLAR_RADIUS,
        0,
        Math.sin(theta) * PILLAR_RADIUS
      ),
      scaleY: 2.5 + Math.random() * 2,
      rot: Math.random() * Math.PI,
    })
  }
  return data
}

function generatePlatforms(): PlatformData[] {
  return [
    { pos: new THREE.Vector3(3, 2.5, 4), size: [2.5, 0.06, 1.8], rotY: 0.3, rotX: 0.05 },
    { pos: new THREE.Vector3(-3.5, 3.2, -3), size: [2, 0.06, 2.5], rotY: -0.4, rotX: -0.08 },
    { pos: new THREE.Vector3(4.5, 1.8, -3.5), size: [1.8, 0.06, 1.8], rotY: 0.6, rotX: 0.03 },
    { pos: new THREE.Vector3(-4, 4, 3.5), size: [2.2, 0.06, 2], rotY: -0.2, rotX: 0.1 },
    { pos: new THREE.Vector3(0, 3.8, -5), size: [3, 0.06, 1.5], rotY: 0, rotX: -0.05 },
  ]
}

export function CivilizationStructures({
  phaseRef,
}: {
  phaseRef: React.RefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const chamberGroupRef = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(0)

  const pillars = useMemo(() => generatePillars(), [])
  const platforms = useMemo(() => generatePlatforms(), [])

  const observatoryGeos = useMemo(
    () =>
      OBSERVATORY_RINGS.map(
        (r) => new THREE.TorusGeometry(r.radius, r.tube, 40, 80)
      ),
    []
  )

  const chamberGeos = useMemo(
    () =>
      CHAMBER_RINGS.map(
        (r) => new THREE.TorusGeometry(r.radius, r.tube, 32, 64)
      ),
    []
  )

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    const phase = phaseRef.current

    const obsOpacity = phaseValue(phase, {
      start: PHASES.ARRIVAL.start,
      end: PHASES.OBSERVATORY.end,
    }) * (1 - phaseValue(phase, { start: PHASES.CHAMBER.start, end: PHASES.CHAMBER.start + 0.15 }))

    const archOpacity = phaseValue(phase, PHASES.ARCHITECTURE) *
      (1 - phaseValue(phase, { start: PHASES.CHAMBER.start + 0.2, end: PHASES.CHAMBER.end }))

    const chamberOpacity = phaseValue(phase, PHASES.CHAMBER)
    const revelOpacity = phaseValue(phase, PHASES.REVELATION)

    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        if (child.userData.isObservatory) {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
          mat.opacity = obsOpacity * 0.3
          child.rotation.y += delta * 0.02 * (child.userData.radius ?? 1) * 0.1
        }
        if (child.userData.isPillar) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
          mat.opacity = archOpacity * 0.25
        }
        if (child.userData.isPlatform) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
          mat.opacity = archOpacity * 0.15
          const floatY = Math.sin(t * 0.3 + (child.userData.index ?? 0)) * 0.03
          child.position.y += (child.userData.baseY + floatY - child.position.y) * 0.02
        }
      })
    }

    if (chamberGroupRef.current) {
      chamberGroupRef.current.children.forEach((child) => {
        if (child.userData.isChamberRing) {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
          mat.opacity = chamberOpacity * 0.35
          child.rotation.z += delta * 0.04
        }
        if (child.userData.isPedestal) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
          mat.opacity = chamberOpacity * 0.4
        }
      })
    }

    if (coreRef.current) {
      const coreOp = chamberOpacity * 0.6 + revelOpacity * 0.3
      const coreMat = coreRef.current.material as THREE.MeshBasicMaterial
      coreMat.opacity = Math.min(coreOp, 0.7)
      coreRef.current.rotation.x = t * 0.15
      coreRef.current.rotation.y = t * 0.2
      const pulse = 1 + Math.sin(t * 0.8) * 0.03 + revelOpacity * 0.05
      coreRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <>
      <group ref={groupRef}>
        {observatoryGeos.map((geo, i) => {
          const cfg = OBSERVATORY_RINGS[i]
          return (
            <mesh
              key={`obs-${i}`}
              geometry={geo}
              position={[0, cfg.y, 0]}
              rotation={[cfg.tiltX, 0, 0]}
              userData={{
                isObservatory: true,
                radius: cfg.radius,
              }}
            >
              <meshBasicMaterial
                color={cfg.color}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )
        })}

        {pillars.map((p, i) => (
          <mesh
            key={`pillar-${i}`}
            position={p.pos}
            scale={[1, p.scaleY, 1]}
            rotation={[0, p.rot, 0]}
            userData={{ isPillar: true }}
          >
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color="#5A4A3A"
              roughness={0.7}
              metalness={0.2}
              transparent
              opacity={0}
            />
          </mesh>
        ))}

        {platforms.map((p, i) => (
          <mesh
            key={`platform-${i}`}
            position={p.pos}
            rotation={[p.rotX, p.rotY, 0]}
            userData={{
              isPlatform: true,
              index: i,
              baseY: p.pos.y,
            }}
          >
            <boxGeometry args={p.size} />
            <meshStandardMaterial
              color="#4A3F35"
              roughness={0.6}
              metalness={0.3}
              transparent
              opacity={0}
            />
          </mesh>
        ))}
      </group>

      <group ref={chamberGroupRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} userData={{ isChamberRing: true }}>
          <ringGeometry args={[0.2, 5, 64]} />
          <meshBasicMaterial
            color="#2A2520"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {chamberGeos.map((geo, i) => {
          const cfg = CHAMBER_RINGS[i]
          return (
            <mesh
              key={`chamber-ring-${i}`}
              geometry={geo}
              position={[0, cfg.y, 0]}
              userData={{ isChamberRing: true }}
            >
              <meshBasicMaterial
                color={cfg.color}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )
        })}

        <mesh position={[0, -0.15, 0]} userData={{ isPedestal: true }}>
          <cylinderGeometry args={[1.2, 1.5, 0.2, 24]} />
          <meshStandardMaterial
            color="#3A3028"
            roughness={0.5}
            metalness={0.4}
            transparent
            opacity={0}
          />
        </mesh>

        <mesh position={[0, 0.2, 0]} ref={coreRef}>
          <icosahedronGeometry args={[0.25, 2]} />
          <meshBasicMaterial
            color="#D4A853"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  )
}
