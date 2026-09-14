'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'

/*
  Scroll-linked visualization of REBAL's core motif:
  multiple assets → converging → into one portfolio.
  Token spheres drift inward and lock into a portfolio ring as the
  section scrolls through the viewport.
*/

const TOKEN_COLORS = ['#2AD4E8', '#2E5BFF', '#8B5CF6', '#E84D8A', '#F97D3C', '#F5B83D', '#1B2A8F', '#2775CA']

function TokenSpheres({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null)
  const count = TOKEN_COLORS.length

  const seeds = useMemo(
    () =>
      TOKEN_COLORS.map((color, i) => ({
        color,
        angle: (i / count) * Math.PI * 2,
        scatterR: 34 + (i % 3) * 9,
        scatterY: ((i % 4) - 1.5) * 7,
        ringR: 13,
        speed: 0.4 + (i % 3) * 0.15,
      })),
    [count],
  )

  useFrame((state) => {
    if (!group.current) return
    const p = progress.get()
    const t = state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const s = seeds[i]
      const r = THREE.MathUtils.lerp(s.scatterR, s.ringR, p)
      const y = THREE.MathUtils.lerp(s.scatterY, 0, p)
      const a = s.angle + t * s.speed * (1 - p * 0.7)
      child.position.set(Math.cos(a) * r, y + Math.sin(t * 0.8 + i) * 1.2 * (1 - p), Math.sin(a) * r)
      const scale = THREE.MathUtils.lerp(1.15, 0.75, p)
      child.scale.setScalar(scale)
    })
    group.current.rotation.y = t * 0.12
  })

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1.7, 32, 32]} />
          <meshStandardMaterial color={s.color} roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

function PortfolioCore({ progress }: { progress: MotionValue<number> }) {
  const ring = useRef<THREE.Mesh>(null)
  const core = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const p = progress.get()
    const t = state.clock.elapsedTime
    if (ring.current) {
      const mat = ring.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.15 + p * 0.5
      ring.current.rotation.z = t * 0.2
      ring.current.scale.setScalar(0.9 + p * 0.25)
    }
    if (core.current) {
      const mat = core.current.material as THREE.MeshStandardMaterial
      mat.opacity = p * 0.85
      core.current.scale.setScalar(0.6 + p * 0.55)
      core.current.rotation.y = t * 0.4
    }
  })

  return (
    <group>
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[13, 0.55, 24, 96]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.6}
          transparent
          opacity={0.2}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[5.2, 2]} />
        <meshStandardMaterial
          color="#2E5BFF"
          emissive="#2E5BFF"
          emissiveIntensity={0.5}
          transparent
          opacity={0}
          roughness={0.25}
          flatShading
        />
      </mesh>
    </group>
  )
}

export default function ConvergenceScene({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 6, 52], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[20, 30, 20]} intensity={120} color="#8B5CF6" />
      <pointLight position={[-25, -10, 15]} intensity={80} color="#2AD4E8" />
      <TokenSpheres progress={progress} />
      <PortfolioCore progress={progress} />
    </Canvas>
  )
}
