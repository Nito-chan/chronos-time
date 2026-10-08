"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useHeroStore } from "./hero-store"

const CRYSTAL_COLOR = "#1A1030"
const CYAN = "#22D3EE"

const GOLDEN_RATIO = 1.618

const RING_RADII = {
  inner: 2,
  middle: 2 * GOLDEN_RATIO,
  outer: 2 * GOLDEN_RATIO * GOLDEN_RATIO,
}

type RingAxis = 0 | 1 | 2

const RING_CONFIGS = [
  {
    radius: RING_RADII.inner,
    tube: 0.08,
    color: "#8A8A8A",
    roughness: 0.15,
    metalness: 0.9,
    anisotropy: 0.5,
    arc: Math.PI * 1.6,
    gapRotation: [0, 0, 0] as [number, number, number],
    speed: 0.3,
    axis: 0 as RingAxis,
  },
  {
    radius: RING_RADII.middle,
    tube: 0.06,
    color: "#2A2A2A",
    roughness: 0.05,
    metalness: 1.0,
    anisotropy: 0.8,
    arc: Math.PI * 1.7,
    gapRotation: [0, 2.09, 0] as [number, number, number],
    speed: 0.14,
    axis: 1 as RingAxis,
  },
  {
    radius: RING_RADII.outer,
    tube: 0.1,
    color: "#3A3028",
    roughness: 0.6,
    metalness: 0.7,
    anisotropy: 0,
    arc: Math.PI * 1.5,
    gapRotation: [0, 4.19, 0] as [number, number, number],
    speed: 0.07,
    axis: 2 as RingAxis,
  },
]

function Crystal() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(0)

  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.6, 1)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      // eslint-disable-next-line react-hooks/purity
      const displace = 1 + (Math.random() - 0.5) * 0.06
      pos.setXYZ(i, x * displace, y * displace, z * displace)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  const innerGeo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.25, 0)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      // eslint-disable-next-line react-hooks/purity
      const displace = 1 + (Math.random() - 0.5) * 0.04
      pos.setXYZ(i, x * displace, y * displace, z * displace)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [])

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    const breathe = 1 + Math.sin(t * 0.785) * 0.015
    meshRef.current.scale.setScalar(breathe)
    meshRef.current.rotation.y = t * 0.03
    meshRef.current.rotation.x = Math.sin(t * 0.02) * 0.05

    const innerPulse = 0.3 + Math.sin(t * 0.524) * 0.15
    const mat = innerRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = innerPulse
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geo}>
        <meshPhysicalMaterial
          color={CRYSTAL_COLOR}
          roughness={0}
          metalness={0}
          transmission={0.85}
          ior={2.0}
          thickness={0.5}
          transparent
          opacity={0.85}
          envMapIntensity={1.2}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={innerRef} geometry={innerGeo}>
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color={CYAN} intensity={0.4} distance={2} decay={2} />
    </group>
  )
}

function Ring({ config }: { config: (typeof RING_CONFIGS)[0] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const speedRef = useRef(config.speed)
  const scrollProgress = useHeroStore((s) => s.scrollProgress)

  const geo = useMemo(
    () =>
      new THREE.TorusGeometry(config.radius, config.tube, 48, 24, config.arc),
    [config.radius, config.tube, config.arc]
  )

  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: config.roughness,
      metalness: config.metalness,
      envMapIntensity: 1,
      side: THREE.DoubleSide,
    })
    if (config.anisotropy > 0) {
      const mat = m as unknown as Record<string, unknown>
      mat.anisotropy = config.anisotropy
      mat.anisotropyRotation = 0
    }
    return m
  }, [config.color, config.roughness, config.metalness, config.anisotropy])

  useFrame((_, delta) => {
    const sp = scrollProgress
    speedRef.current = config.speed * (1 + sp * 0.6)

    const euler = meshRef.current.rotation
    const axes: ("x" | "y" | "z")[] = ["x", "y", "z"]
    const axis = axes[config.axis]
    euler[axis] += delta * speedRef.current

    if (sp > 0.01) {
      const wobbleAxis = axes[(config.axis + 1) % 3]
      euler[wobbleAxis] +=
        Math.sin(Date.now() * 0.001) * delta * sp * 0.02
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geo}
      material={mat}
      rotation={config.gapRotation}
    />
  )
}

function Shards() {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  const shardData = useMemo(() => {
    const seed = (i: number) => ((i * 16807 + 1) % 2147483647) / 2147483647
    const data: {
      pos: [number, number, number]
      rot: [number, number, number]
      speed: number
      scale: number
    }[] = []
    for (let i = 0; i < 8; i++) {
      const s1 = seed(i)
      const s2 = seed(i + 10)
      const s3 = seed(i + 20)
      const theta = s1 * Math.PI * 2
      const phi = Math.acos(2 * s2 - 1)
      const r = 1.5 + s3 * 4
      data.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        rot: [
          s1 * Math.PI,
          s2 * Math.PI,
          s3 * Math.PI,
        ],
        speed: 0.2 + s3 * 0.5,
        scale: 0.3 + (seed(i + 30) * 0.7),
      })
    }
    return data
  }, [])

  const shardGeo = useMemo(() => {
    const g = new THREE.TetrahedronGeometry(0.08)
    return g
  }, [])

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    groupRef.current.children.forEach((child, i) => {
      const d = shardData[i]
      if (!d) return
      child.rotation.x += delta * d.speed * 0.3
      child.rotation.y += delta * d.speed * 0.5
      child.rotation.z += delta * d.speed * 0.2

      const drift = Math.sin(t * d.speed + i) * 0.02
      child.position.x = d.pos[0] + drift
      child.position.y = d.pos[1] + Math.cos(t * d.speed * 0.7 + i) * 0.02
      child.position.z = d.pos[2] + Math.sin(t * d.speed * 0.5 + i) * 0.02
    })
  })

  return (
    <group ref={groupRef}>
      {shardData.map((d, i) => (
        <mesh
          key={i}
          geometry={shardGeo}
          position={d.pos}
          rotation={d.rot}
          scale={d.scale}
        >
          <meshPhysicalMaterial
            color={CRYSTAL_COLOR}
            roughness={0.1}
            metalness={0}
            transmission={0.7}
            ior={1.8}
            transparent
            opacity={0.6}
            clearcoat={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function Thread({ data }: { data: { points: THREE.Vector3[]; offset: number } }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const timeRef = useRef(0)

  const curve = useMemo(() => new THREE.CatmullRomCurve3(data.points), [data.points])
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 40, 0.008, 4, false), [curve])
  const tubeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
      }),
    []
  )

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    meshRef.current.rotation.y = t * 0.05 + data.offset
    meshRef.current.rotation.x = Math.sin(t * 0.03 + data.offset) * 0.05
  })

  return <mesh ref={meshRef} geometry={tubeGeo} material={tubeMat} />
}

function EnergyThreads() {
  const groupRef = useRef<THREE.Group>(null!)

  const threads = useMemo(() => {
    const result: { points: THREE.Vector3[]; offset: number }[] = []
    for (let t = 0; t < 3; t++) {
      const pts: THREE.Vector3[] = []
      const startAngle = (t / 3) * Math.PI * 2
      for (let i = 0; i <= 20; i++) {
        const progress = i / 20
        const angle = startAngle + progress * Math.PI * 2 * 2
      const r = 0.8 + progress * 4 * (0.8 + (i * 17 % 10) / 10 * 0.4)
        const x = r * Math.cos(angle)
        const z = r * Math.sin(angle)
        const y =
          Math.sin(progress * Math.PI * 3) * 0.3 * (1 - progress * 0.5)
        pts.push(new THREE.Vector3(x, y, z))
      }
      result.push({ points: pts, offset: (t * 7919 % 10000) / 10000 * Math.PI * 2 })
    }
    return result
  }, [])

  return (
    <group ref={groupRef}>
      {threads.map((thread, i) => (
        <Thread key={i} data={thread} />
      ))}
    </group>
  )
}

export function HeroCore() {
  const groupRef = useRef<THREE.Group>(null!)
  const mouseX = useHeroStore((s) => s.mouseX)
  const mouseY = useHeroStore((s) => s.mouseY)
  const scrollProgress = useHeroStore((s) => s.scrollProgress)

  useFrame(() => {
    const followX = mouseX * 0.03
    const followY = mouseY * 0.03

    groupRef.current.position.x +=
      (followX - groupRef.current.position.x) * 0.03
    groupRef.current.position.y +=
      (followY - groupRef.current.position.y) * 0.03

    const sp = scrollProgress
    if (sp > 0.01) {
      const s = 1 + sp * 0.05
      groupRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef}>
      <Crystal />
      {RING_CONFIGS.map((config, i) => (
        <Ring key={i} config={config} />
      ))}
      <Shards />
      <EnergyThreads />
    </group>
  )
}
