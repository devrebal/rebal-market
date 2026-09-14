'use client'

import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import { RebalLogo3D } from './rebal-logo-3d'

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 150], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[60, 80, 60]} intensity={1.4} />
      <directionalLight position={[-60, -20, 40]} intensity={0.4} />
      <RebalLogo3D scale={0.62} />
      <ContactShadows position={[0, -42, 0]} opacity={0.22} scale={160} blur={2.6} far={60} />
      <Environment preset="city" />
    </Canvas>
  )
}
