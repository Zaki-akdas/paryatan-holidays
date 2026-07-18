import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useIsMobile, prefersReducedMotion } from '../../lib/useIsMobile'

function Floater({ pos, speed, scale, color, kind = 'plane' }:{pos:[number,number,number], speed:number, scale:number, color:string, kind?: 'plane'|'suitcase'|'camera'|'balloon'|'pin'}) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = pos[1] + Math.sin(t * speed) * 0.38
    ref.current.rotation.y += 0.0055
    ref.current.rotation.x = Math.sin(t*0.33)*0.12
    ref.current.rotation.z = Math.cos(t*speed*0.7)*0.08
  })
  return (
    <group ref={ref} position={pos} scale={scale}>
      {kind === 'plane' && (
        <mesh rotation={[0,0,Math.PI/10]}>
          <coneGeometry args={[0.22, 0.55, 4]} />
          <meshStandardMaterial color={color} transparent opacity={0.78} roughness={0.55} />
        </mesh>
      )}
      {kind === 'suitcase' && (
        <group>
          <mesh>
            <boxGeometry args={[0.46, 0.32, 0.16]} />
            <meshStandardMaterial color={color} roughness={0.55} transparent opacity={0.84} />
          </mesh>
          <mesh position={[0,0.19,0]}>
            <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#37424a" />
          </mesh>
        </group>
      )}
      {kind === 'camera' && (
        <group>
          <mesh>
            <boxGeometry args={[0.36, 0.26, 0.22]} />
            <meshStandardMaterial color={color} roughness={0.5} transparent opacity={0.82} />
          </mesh>
          <mesh position={[0,0,0.14]}>
            <cylinderGeometry args={[0.11,0.11,0.09,24]} />
            <meshStandardMaterial color="#1f2a32" />
          </mesh>
        </group>
      )}
      {kind === 'balloon' && (
        <group>
          <mesh position={[0,0.18,0]}>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial color={color} transparent opacity={0.82} />
          </mesh>
          <mesh position={[0,-0.08,0]}>
            <boxGeometry args={[0.09,0.07,0.09]} />
            <meshStandardMaterial color="#7a5a3a" />
          </mesh>
        </group>
      )}
      {kind === 'pin' && (
        <group>
          <mesh position={[0,0.12,0]} rotation={[Math.PI,0,0]}>
            <coneGeometry args={[0.14, 0.28, 20]} />
            <meshStandardMaterial color={color} transparent opacity={0.86} />
          </mesh>
          <mesh position={[0,0.26,0]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#fff" emissive={color} emissiveIntensity={0.18} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function Rig({ scroll }: { scroll: number }) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    if (group.current) {
      group.current.position.y = scroll * 2.9
      group.current.rotation.y = scroll * 0.42
    }
  })
  return (
    <group ref={group}>
      <Floater pos={[-3.1, 0.8, -2]} speed={0.72} scale={1} color="#ffb466" kind="plane" />
      <Floater pos={[2.7, -0.5, -1.6]} speed={0.88} scale={0.9} color="#6ad3e6" kind="camera" />
      <Floater pos={[-1.6, -1.35, -2.3]} speed={0.62} scale={0.82} color="#ffd89a" kind="suitcase" />
      <Floater pos={[1.8, 1.35, -2.6]} speed={0.8} scale={0.95} color="#ff8a6b" kind="balloon" />
      <Floater pos={[-2.5, 1.85, -1.9]} speed={0.58} scale={0.78} color="#7fd4b6" kind="pin" />
      <Floater pos={[0.15, -2.0, -2.1]} speed={0.74} scale={0.86} color="#8edfff" kind="plane" />
      <Floater pos={[2.9, 1.95, -2.4]} speed={0.66} scale={0.74} color="#f5a6d6" kind="camera" />
      <Floater pos={[-2.9, -1.2, -2.0]} speed={0.71} scale={0.8} color="#ffe07a" kind="suitcase" />
      {/* soft clouds */}
      {Array.from({length: 7}).map((_,i)=>(
        <mesh key={i} position={[(i-3)*1.6, (i%3-1)*1.2, -4.6]} scale={[1.35,0.5,0.5]}>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.028} />
        </mesh>
      ))}
    </group>
  )
}

export default function ScrollScene() {
  const scrollRef = useRef(0)
  const isMobile = useIsMobile()
  const reduced = prefersReducedMotion()
  const enabled = !isMobile && !reduced

  useEffect(() => {
    if (!enabled) return
    const onScroll = () => {
      scrollRef.current = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  // The floating 3D props are decorative. Skip the WebGL canvas on mobile
  // and for reduced-motion users so mobile load/scroll stays smooth.
  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] opacity-[0.98]">
      <Canvas camera={{ position: [0,0,5], fov: 55 }} dpr={[1,1.45]}>
        <ambientLight intensity={0.95} />
        <directionalLight position={[3,3,3]} intensity={1.0} />
        <ScrollWrapper scrollRef={scrollRef} />
      </Canvas>
    </div>
  )
}

function ScrollWrapper({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const s = useRef(0)
  useFrame(() => {
    s.current += (scrollRef.current - s.current) * 0.07
  })
  return <Rig scroll={s.current} />
}
