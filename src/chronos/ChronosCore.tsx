"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useChronosStore } from "./store"

const CYAN = "#22D3EE"
const VIOLET = "#8B5CF6"
const GOLD = "#D4A853"
const CRYSTAL = "#1A1030"
const PHI = 1.618

function useDisplacedIcosa(radius: number, detail: number, amount: number, seed: number) {
  return useMemo(() => {
    const g = new THREE.IcosahedronGeometry(radius, detail)
    const pos = g.attributes.position
    const pseudo = (i: number) => {
      const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    for (let i = 0; i < pos.count; i++) {
      const d = 1 + (pseudo(i) - 0.5) * amount
      pos.setXYZ(i, pos.getX(i) * d, pos.getY(i) * d, pos.getZ(i) * d)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [radius, detail, amount, seed])
}

function Crystal({ progress }: { progress: number }) {
  const outer = useRef<THREE.Mesh>(null!)
  const inner = useRef<THREE.Mesh>(null!)
  const time = useRef(0)
  const outerGeo = useDisplacedIcosa(0.62, 1, 0.07, 1)
  const innerGeo = useDisplacedIcosa(0.24, 0, 0.05, 7)

  useFrame((_, delta) => {
    time.current += delta
    const t = time.current
    const assemble = THREE.MathUtils.smoothstep(progress, 0.0, 0.12)
    const breathe = 1 + Math.sin(t * 0.785) * 0.015
    outer.current.scale.setScalar(Math.max(0.0001, assemble * breathe))
    outer.current.rotation.y = t * 0.05
    outer.current.rotation.x = Math.sin(t * 0.11) * 0.06
    const mat = inner.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.35 + Math.sin(t * 0.524) * 0.18 + progress * 0.25
    inner.current.scale.setScalar(Math.max(0.0001, assemble))
    inner.current.rotation.y = -t * 0.08
  })

  return (
    <group>
      <mesh ref={outer} geometry={outerGeo}>
        <meshPhysicalMaterial
          color={CRYSTAL}
          roughness={0.05}
          metalness={0.1}
          transmission={0.88}
          ior={2.0}
          thickness={0.6}
          transparent
          opacity={0.9}
          clearcoat={0.4}
          clearcoatRoughness={0.25}
          envMapIntensity={1.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={inner} geometry={innerGeo}>
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.4}
          transparent
          opacity={0.65}
        />
      </mesh>
      <pointLight color={CYAN} intensity={2.2} distance={4} decay={2} />
    </group>
  )
}

const RINGS = [
  { r: 2, tube: 0.055, color: "#8A8A8A", rough: 0.22, metal: 0.92, arc: Math.PI * 1.62, speed: 0.32, axis: "x" as const, appear: 0.1 },
  { r: 2 * PHI, tube: 0.045, color: "#2E2E33", rough: 0.08, metal: 1.0, arc: Math.PI * 1.7, speed: 0.16, axis: "y" as const, appear: 0.18 },
  { r: 2 * PHI * 1.28, tube: 0.07, color: "#4A4038", rough: 0.62, metal: 0.72, arc: Math.PI * 1.5, speed: 0.08, axis: "z" as const, appear: 0.26 },
]

function Ring({ cfg, progress, fracture }: { cfg: (typeof RINGS)[number]; progress: number; fracture: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const geo = useMemo(
    () => new THREE.TorusGeometry(cfg.r, cfg.tube, 24, 140, cfg.arc),
    [cfg.r, cfg.tube, cfg.arc]
  )
  useFrame((state, delta) => {
    const a = THREE.MathUtils.smoothstep(progress, cfg.appear, cfg.appear + 0.12)
    ref.current.scale.setScalar(Math.max(0.0001, a))
    const boost = 1 + fracture * 2.2
    if (cfg.axis === "x") ref.current.rotation.x += delta * cfg.speed * boost
    if (cfg.axis === "y") ref.current.rotation.y += delta * cfg.speed * boost
    if (cfg.axis === "z") ref.current.rotation.z += delta * cfg.speed * boost
    // drift wobble — never mechanical
    ref.current.rotation.y += Math.sin(state.clock.elapsedTime * 0.2) * delta * 0.03
    ref.current.rotation.x += Math.cos(state.clock.elapsedTime * 0.16) * delta * 0.02
  })
  return (
    <mesh ref={ref} geometry={geo} rotation={[Math.PI / 2.4, 0.4, 0]}>
      <meshStandardMaterial
        color={cfg.color}
        roughness={cfg.rough}
        metalness={cfg.metal}
        envMapIntensity={1.0}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Shards({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null!)
  const t = useRef(0)
  const data = useMemo(() => {
    const out: { p: [number, number, number]; s: number; v: number }[] = []
    for (let i = 0; i < 9; i++) {
      const th = (i / 9) * Math.PI * 2 + (i % 3) * 0.5
      const r = 1.4 + ((i * 37) % 10) / 10 * 3.4
      out.push({
        p: [r * Math.cos(th), (((i * 53) % 10) / 10 - 0.5) * 3, r * Math.sin(th)],
        s: 0.35 + ((i * 29) % 10) / 10 * 0.9,
        v: 0.2 + ((i * 17) % 10) / 10 * 0.6,
      })
    }
    return out
  }, [])
  const geo = useMemo(() => new THREE.TetrahedronGeometry(0.09), [])
  useFrame((_, delta) => {
    t.current += delta
    const a = THREE.MathUtils.smoothstep(progress, 0.22, 0.4)
    group.current.scale.setScalar(Math.max(0.0001, a))
    group.current.children.forEach((c, i) => {
      const d = data[i]
      if (!d) return
      c.rotation.x += delta * d.v * 0.5
      c.rotation.y += delta * d.v * 0.7
      c.position.y = d.p[1] + Math.sin(t.current * d.v + i * 1.7) * 0.18
      c.position.x = d.p[0] + Math.cos(t.current * d.v * 0.6 + i) * 0.12
    })
  })
  return (
    <group ref={group}>
      {data.map((d, i) => (
        <mesh key={i} geometry={geo} position={d.p} scale={d.s}>
          <meshPhysicalMaterial
            color={i === 8 ? GOLD : CRYSTAL}
            roughness={0.12}
            transmission={0.6}
            transparent
            opacity={0.7}
            clearcoat={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function Threads({ progress }: { progress: number }) {
  const g = useRef<THREE.Group>(null!)
  const tubes = useMemo(() => {
    const arr: THREE.TubeGeometry[] = []
    for (let k = 0; k < 3; k++) {
      const pts: THREE.Vector3[] = []
      const start = (k / 3) * Math.PI * 2
      for (let i = 0; i <= 24; i++) {
        const pr = i / 24
        const ang = start + pr * Math.PI * 4
        const r = 0.8 + pr * 3.6
        pts.push(
          new THREE.Vector3(
            r * Math.cos(ang),
            Math.sin(pr * Math.PI * 3 + k) * 0.35 * (1 - pr * 0.4),
            r * Math.sin(ang)
          )
        )
      }
      arr.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.006, 5, false))
    }
    return arr
  }, [])
  useFrame((state) => {
    const a = THREE.MathUtils.smoothstep(progress, 0.3, 0.5)
    g.current.scale.setScalar(Math.max(0.0001, a))
    g.current.rotation.y = state.clock.elapsedTime * 0.05
  })
  return (
    <group ref={g}>
      {tubes.map((tube, i) => (
        <mesh key={i} geometry={tube}>
          <meshBasicMaterial
            color={i === 2 ? VIOLET : CYAN}
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function Dust({ progress, signal }: { progress: number; signal: number }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const count = 900
    const arr = new Float32Array(count * 3)
    const rand = (i: number, s: number) => {
      const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    for (let i = 0; i < count; i++) {
      const th = rand(i, 1) * Math.PI * 2
      const ph = Math.acos(2 * rand(i, 2) - 1)
      const r = 2.5 + rand(i, 3) * 7
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th)
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7
      arr[i * 3 + 2] = r * Math.cos(ph)
    }
    return arr
  }, [])
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.012
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = 0.25 + signal * 0.5 + progress * 0.15
    mat.size = 0.02 + signal * 0.02
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={CYAN} size={0.025} transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

export function ChronosCore() {
  const group = useRef<THREE.Group>(null!)
  const mouseX = useChronosStore((s) => s.mouseX)
  const mouseY = useChronosStore((s) => s.mouseY)
  const reduced = useChronosStore((s) => s.reducedMotion)

  useFrame(() => {
    const progress = useChronosStore.getState().progress
    // fracture peaks mid-journey (Industry), synthesis calms at end
    const fracture = Math.sin(progress * Math.PI) * (progress > 0.3 && progress < 0.6 ? 1 : 0.35)
    const signal = THREE.MathUtils.smoothstep(progress, 0.55, 0.8)
    group.current.userData.fracture = fracture
    group.current.userData.signal = signal
    if (!reduced) {
      group.current.position.x += (mouseX * 0.35 - group.current.position.x) * 0.03
      group.current.position.y += (mouseY * 0.3 - group.current.position.y) * 0.03
    }
    const s = 1 + progress * 0.12 + Math.sin(Date.now() * 0.0004) * 0.008
    group.current.scale.setScalar(s)
    group.current.rotation.y += 0.0006
  })

  // read per-frame values via subscription-free snapshot inside children:
  // children pull progress directly from store each frame for zero re-render.
  return (
    <group ref={group}>
      <CoreLayers />
    </group>
  )
}

function CoreLayers() {
  const progress = useChronosStore((s) => s.progress)
  const fractureRaw =
    Math.sin(progress * Math.PI) * (progress > 0.3 && progress < 0.6 ? 1 : 0.35)
  const signal = THREE.MathUtils.smoothstep(progress, 0.55, 0.8)
  return (
    <>
      <Crystal progress={progress} />
      {RINGS.map((cfg, i) => (
        <Ring key={i} cfg={cfg} progress={progress} fracture={fractureRaw} />
      ))}
      <Shards progress={progress} />
      <Threads progress={progress} />
      <Dust progress={progress} signal={signal} />
    </>
  )
}
