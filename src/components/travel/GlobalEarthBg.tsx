import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, useTexture } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { useIsMobile, prefersReducedMotion } from '../../lib/useIsMobile'

function SlowEarth() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [earthMap] = useTexture([
    'https://unpkg.com/three-globe@2.32.0/example/img/earth-blue-marble.jpg'
  ])
  if (earthMap) {
    earthMap.colorSpace = THREE.SRGBColorSpace
  }

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.028
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.6, 96, 96]} />
        {earthMap ? (
          <meshStandardMaterial map={earthMap} roughness={0.9} metalness={0.02} transparent opacity={0.95} />
        ) : (
          <meshStandardMaterial color="#1b6f88" roughness={0.8} />
        )}
      </mesh>
      {/* soft atmosphere */}
      <mesh>
        <sphereGeometry args={[2.82, 64, 64]} />
        <meshBasicMaterial color="#9eeaff" transparent opacity={0.035} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

export default function GlobalEarthBg() {
  const isMobile = useIsMobile()
  const reduced = prefersReducedMotion()
  // Disable the heavy WebGL earth on mobile / reduced-motion to protect
  // mobile load speed and battery; the CSS gradient overlay still renders.
  if (isMobile || reduced) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,rgba(250,252,253,0.15)_0%,rgba(246,251,252,0.55)_55%,rgba(243,250,251,0.88)_100%)]" />
        <div className="absolute inset-0 bg-background/78" />
      </div>
    )
  }
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* faint earth canvas */}
      <div className="absolute inset-0 opacity-[0.12] blur-[0.4px] saturate-[0.85]">
        <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }} dpr={[1,1.3]}>
          <ambientLight intensity={1.15} />
          <directionalLight position={[4,2,4]} intensity={1.1} />
          <Stars radius={60} depth={30} count={1200} factor={1.8} fade speed={0.3} />
          <SlowEarth />
        </Canvas>
      </div>
      {/* readability overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,rgba(250,252,253,0.15)_0%,rgba(246,251,252,0.55)_55%,rgba(243,250,251,0.88)_100%)]" />
      <div className="absolute inset-0 bg-background/78" />
      {/* subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(10,45,55,0.035)_100%)]" />
      {/* hide under hero – fade out first ~95vh so hero globe is clean */}
      <div className="absolute top-0 inset-x-0 h-[95vh] bg-gradient-to-b from-background via-background/95 to-transparent pointer-events-none" />
    </div>
  )
}
