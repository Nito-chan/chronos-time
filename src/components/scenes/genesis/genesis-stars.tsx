"use client"

import { useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { phaseValue, PHASES } from "./phases"

const STAR_COUNT = 3000
const NEBULA_CLOUDS = 6

function createNebulaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")!
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  gradient.addColorStop(0, "rgba(255,255,255,0.3)")
  gradient.addColorStop(0.2, "rgba(255,255,255,0.1)")
  gradient.addColorStop(0.5, "rgba(255,255,255,0.03)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

export function GenesisStars({ phaseRef }: { phaseRef: React.RefObject<number> }) {
  const starRef = useRef<THREE.Points>(null!)
  const nebulaRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)
  const [nebulaTex] = useState(() => createNebulaTexture())

  /* eslint-disable react-hooks/purity */
  const starGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)
    const colors = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 20 + Math.random() * 30
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
      positions[i * 3 + 2] = r * Math.cos(phi)
      sizes[i] = 0.04 + Math.random() * 0.12
      const temp = Math.random()
      if (temp < 0.1) {
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 0.3
      } else if (temp < 0.2) {
        colors[i * 3] = 0.5; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 1
      } else {
        colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])
  /* eslint-enable react-hooks/purity */

  const starMat = useMemo(() => {
    const m = new THREE.PointsMaterial({
      size: 0.08,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      vertexColors: true,
    })
    return m
  }, [])

  /* eslint-disable react-hooks/purity */
  const nebulaData = useMemo(() => {
    const data: {
      pos: [number, number, number]
      scale: number
      color: string
      rotSpeed: number
    }[] = []
    const colors = ["#1A0533", "#0A1628", "#1A0A2E", "#0D1B2A", "#2D1B4E", "#1B2838"]
    for (let i = 0; i < NEBULA_CLOUDS; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 8 + Math.random() * 15
      data.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.3,
          r * Math.cos(phi),
        ],
        scale: 5 + Math.random() * 10,
        color: colors[i % colors.length],
        rotSpeed: 0.01 + Math.random() * 0.02,
      })
    }
    return data
  }, [])
  /* eslint-enable react-hooks/purity */

  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    timeRef.current += delta
    const phase = phaseRef.current
    const starsOpacity = phaseValue(phase, PHASES.COSMIC)
    starMat.opacity = starsOpacity * 0.7
    starRef.current.rotation.y = timeRef.current * 0.003
    starRef.current.rotation.x = Math.sin(timeRef.current * 0.001) * 0.01

    if (nebulaRef.current) {
      nebulaRef.current.children.forEach((child, i) => {
        const d = nebulaData[i]
        const nebOpacity = phaseValue(phase, { start: PHASES.COSMIC.start + 0.05, end: PHASES.COSMIC.end - 0.1 })
        const mat = (child as THREE.Sprite).material as THREE.SpriteMaterial
        mat.opacity = nebOpacity * 0.2
        child.rotation.z = timeRef.current * (d?.rotSpeed ?? 0.01)
      })
    }
  })
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      <points ref={starRef} geometry={starGeo} material={starMat} />

      <group ref={nebulaRef}>
        {nebulaData.map((d, i) => (
          <sprite key={i} position={d.pos} scale={d.scale}>
            <spriteMaterial
              map={nebulaTex}
              color={d.color}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        ))}
      </group>
    </>
  )
}
