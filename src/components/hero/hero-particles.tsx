"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useHeroStore } from "./hero-store"

const STAR_COUNT = 2000
const DUST_COUNT = 500
const SPHERE_RADIUS = 40

export function HeroParticles() {
  const starRef = useRef<THREE.Points>(null!)
  const dustRef = useRef<THREE.Points>(null!)
  const dustMatRef = useRef<THREE.PointsMaterial>(null!)
  const scrollProgress = useHeroStore((s) => s.scrollProgress)
  const mouseX = useHeroStore((s) => s.mouseX)
  const mouseY = useHeroStore((s) => s.mouseY)
  const timeRef = useRef(0)

  const starGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)
    for (let i = 0; i < STAR_COUNT; i++) {
      // eslint-disable-next-line react-hooks/purity
      const theta = Math.random() * Math.PI * 2
      // eslint-disable-next-line react-hooks/purity
      const phi = Math.acos(2 * Math.random() - 1)
      // eslint-disable-next-line react-hooks/purity
      const r = SPHERE_RADIUS * Math.cbrt(Math.random())
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      // eslint-disable-next-line react-hooks/purity
      sizes[i] = 0.5 + Math.random() * 2
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [])

  const dustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(DUST_COUNT * 3)
    for (let i = 0; i < DUST_COUNT; i++) {
      // eslint-disable-next-line react-hooks/purity
      const theta = Math.random() * Math.PI * 2
      // eslint-disable-next-line react-hooks/purity
      const phi = Math.acos(2 * Math.random() - 1)
      // eslint-disable-next-line react-hooks/purity
      const r = 3 + Math.random() * 8
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  const starMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#F5F5F5"),
        size: 0.08,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  )

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    starRef.current.rotation.y = t * 0.005
    starRef.current.rotation.x = Math.sin(t * 0.003) * 0.01

    dustRef.current.rotation.y = t * 0.01
    dustRef.current.rotation.x = Math.sin(t * 0.008) * 0.005

    const sp = scrollProgress
    const mat = dustMatRef.current

    if (sp > 0.01) {
      const intensity = Math.min(sp * 2, 1)
      mat.opacity = 0.15 + intensity * 0.25
      dustRef.current.rotation.y += delta * sp * 0.02

      const spiralX = mouseX * sp * 0.3
      const spiralY = mouseY * sp * 0.3
      dustRef.current.position.x = spiralX
      dustRef.current.position.y = spiralY
    } else {
      mat.opacity = 0.15
    }
  })

  return (
    <>
      <points ref={starRef} geometry={starGeo} material={starMat} />
      <points ref={dustRef} geometry={dustGeo}>
        <pointsMaterial
          ref={dustMatRef}
          color="#22D3EE"
          size={0.015}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </>
  )
}
