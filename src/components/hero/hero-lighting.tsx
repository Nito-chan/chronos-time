"use client"

export function HeroLighting() {
  return (
    <>
      <ambientLight intensity={0.15} color="#1A1A2E" />

      <directionalLight
        position={[5, 8, 6]}
        intensity={1.2}
        color="#FFFFFF"
        castShadow={false}
      />

      <directionalLight
        position={[-4, -2, -6]}
        intensity={0.2}
        color="#8B5CF6"
      />

      <directionalLight
        position={[-3, 4, -5]}
        intensity={0.6}
        color="#22D3EE"
      />

      <hemisphereLight
        args={["#0A0A1A", "#050505", 0.3]}
      />
    </>
  )
}
