'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

/*
  Procedural 3D interpretation of the REBAL "R" mark.
  The silhouette is approximated from the logo; the REBAL gradient
  (cyan → blue → navy → violet → magenta → orange → yellow) is applied
  as vertex colors sampled along the diagonal, echoing the original mark.
*/

const STOPS: Array<[number, string]> = [
  [0.0, '#2AD4E8'],
  [0.22, '#2E5BFF'],
  [0.4, '#1B2A8F'],
  [0.58, '#8B5CF6'],
  [0.74, '#E84D8A'],
  [0.88, '#F97D3C'],
  [1.0, '#F5B83D'],
]

function gradientColor(t: number) {
  const clamped = Math.min(1, Math.max(0, t))
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [t0, c0] = STOPS[i]
    const [t1, c1] = STOPS[i + 1]
    if (clamped >= t0 && clamped <= t1) {
      const a = new THREE.Color(c0)
      const b = new THREE.Color(c1)
      return a.lerp(b, (clamped - t0) / (t1 - t0))
    }
  }
  return new THREE.Color(STOPS[STOPS.length - 1][1])
}

function buildRGeometry() {
  const s = new THREE.Shape()
  // Silhouette approximates the REBAL mark: sharp left tip on the top bar,
  // rounded bowl on the right, thick diagonal leg.
  s.moveTo(0, 80)
  s.lineTo(48, 80)
  s.bezierCurveTo(74, 80, 94, 70, 94, 52)
  s.bezierCurveTo(94, 33, 79, 25, 58, 25)
  s.lineTo(46, 25)
  s.lineTo(90, 0)
  s.lineTo(56, 0)
  s.lineTo(28, 42)
  s.lineTo(18, 42)
  s.lineTo(0, 68)
  s.closePath()

  const hole = new THREE.Path()
  hole.moveTo(30, 64)
  hole.bezierCurveTo(46, 64, 64, 60, 64, 50)
  hole.bezierCurveTo(64, 40, 48, 36, 34, 36)
  hole.lineTo(30, 36)
  hole.closePath()
  s.holes.push(hole)

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 2.5,
    bevelSize: 2.5,
    bevelSegments: 6,
    curveSegments: 24,
  })
  geo.center()

  const pos = geo.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const box = new THREE.Box3().setFromBufferAttribute(pos)
  const sizeVec = new THREE.Vector3()
  box.getSize(sizeVec)
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getX(i) - box.min.x) / sizeVec.x * 0.55 + (pos.getY(i) - box.min.y) / sizeVec.y * 0.45
    const c = gradientColor(t)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geo
}

export function RebalLogo3D({ scale = 1 }: { scale?: number }) {
  const geometry = useMemo(buildRGeometry, [])
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.25
    // subtle cursor parallax
    const targetX = state.pointer.y * 0.25
    const targetZ = -state.pointer.x * 0.15
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.05
  })

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={group} scale={scale}>
        <mesh geometry={geometry}>
          <meshStandardMaterial vertexColors roughness={0.28} metalness={0.15} />
        </mesh>
      </group>
    </Float>
  )
}
