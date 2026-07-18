import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useIsMobile, prefersReducedMotion } from '../../lib/useIsMobile'

// Convert lat/lon to 3D position
const latLonToVec = (lat: number, lon: number, r: number) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

// All Paryatan itinerary destinations
const DESTINATIONS = [
  // North India
  { name: 'Delhi', lat: 28.61, lon: 77.20, pkg: 'Golden Triangle' },
  { name: 'Agra', lat: 27.17, lon: 78.01, pkg: 'Golden Triangle' },
  { name: 'Jaipur', lat: 26.91, lon: 75.78, pkg: 'Rajasthan' },
  { name: 'Shimla', lat: 31.10, lon: 77.17, pkg: 'Himachal' },
  { name: 'Manali', lat: 32.24, lon: 77.18, pkg: 'Himachal' },
  { name: 'Srinagar', lat: 34.08, lon: 74.79, pkg: 'Kashmir' },
  { name: 'Gulmarg', lat: 34.05, lon: 74.38, pkg: 'Kashmir' },
  { name: 'Pahalgam', lat: 34.01, lon: 75.32, pkg: 'Kashmir' },
  { name: 'Amritsar', lat: 31.63, lon: 74.87, pkg: 'Punjab' },
  { name: 'Dalhousie', lat: 32.53, lon: 75.96, pkg: 'Himachal' },
  { name: 'Dharamshala', lat: 32.21, lon: 76.32, pkg: 'Himachal' },
  { name: 'Haridwar', lat: 29.94, lon: 78.16, pkg: 'Uttarakhand' },
  { name: 'Rishikesh', lat: 30.08, lon: 78.29, pkg: 'Uttarakhand' },
  { name: 'Mussoorie', lat: 30.45, lon: 78.07, pkg: 'Uttarakhand' },
  { name: 'Leh', lat: 34.15, lon: 77.57, pkg: 'Ladakh' },
  { name: 'Nubra', lat: 34.59, lon: 77.57, pkg: 'Ladakh' },
  { name: 'Pangong', lat: 33.75, lon: 78.66, pkg: 'Ladakh' },
  { name: 'Corbett', lat: 29.53, lon: 78.77, pkg: 'Wildlife' },
  { name: 'Vaishno Devi', lat: 33.03, lon: 74.94, pkg: 'Pilgrimage' },

  // West
  { name: 'Goa', lat: 15.29, lon: 74.12, pkg: 'Goa' },
  { name: 'Udaipur', lat: 24.58, lon: 73.68, pkg: 'Rajasthan' },
  { name: 'Mount Abu', lat: 24.59, lon: 72.71, pkg: 'Rajasthan' },
  { name: 'Jodhpur', lat: 26.23, lon: 73.02, pkg: 'Rajasthan' },
  { name: 'Jaisalmer', lat: 26.91, lon: 70.91, pkg: 'Rajasthan' },
  { name: 'Mumbai', lat: 19.07, lon: 72.87, pkg: 'Maharashtra' },
  { name: 'Ahmedabad', lat: 23.02, lon: 72.57, pkg: 'Gujarat' },
  { name: 'Gir', lat: 21.12, lon: 70.79, pkg: 'Wildlife' },
  { name: 'Rann of Kutch', lat: 23.73, lon: 70.12, pkg: 'Gujarat' },

  // South
  { name: 'Kochi', lat: 9.93, lon: 76.26, pkg: 'Kerala' },
  { name: 'Munnar', lat: 10.08, lon: 77.05, pkg: 'Kerala' },
  { name: 'Alleppey', lat: 9.49, lon: 76.33, pkg: 'Kerala' },
  { name: 'Gokarna', lat: 14.54, lon: 74.31, pkg: 'Karnataka' },
  { name: 'Ooty', lat: 11.41, lon: 76.69, pkg: 'Tamil Nadu' },
  { name: 'Kodaikanal', lat: 10.23, lon: 77.48, pkg: 'Tamil Nadu' },
  { name: 'Hyderabad', lat: 17.38, lon: 78.48, pkg: 'Telangana' },
  { name: 'Port Blair', lat: 11.62, lon: 92.72, pkg: 'Andaman' },
  { name: 'Havelock', lat: 11.96, lon: 93.00, pkg: 'Andaman' },
  { name: 'Chennai', lat: 13.08, lon: 80.27, pkg: 'Tamil Nadu' },
  { name: 'Pondicherry', lat: 11.94, lon: 79.80, pkg: 'Puducherry' },

  // East / Northeast
  { name: 'Gangtok', lat: 27.33, lon: 88.61, pkg: 'Sikkim' },
  { name: 'Darjeeling', lat: 27.04, lon: 88.26, pkg: 'West Bengal' },
  { name: 'Shillong', lat: 25.57, lon: 91.88, pkg: 'Meghalaya' },
  { name: 'Cherrapunji', lat: 25.27, lon: 91.73, pkg: 'Meghalaya' },
  { name: 'Kolkata', lat: 22.57, lon: 88.36, pkg: 'West Bengal' },
  { name: 'Kaziranga', lat: 26.57, lon: 93.17, pkg: 'Assam' },
  { name: 'Guwahati', lat: 26.14, lon: 91.73, pkg: 'Assam' },
  { name: 'Puri', lat: 19.81, lon: 85.83, pkg: 'Odisha' },

  // International
  { name: 'Dubai', lat: 25.20, lon: 55.27, pkg: 'UAE' },
  { name: 'Abu Dhabi', lat: 24.47, lon: 54.37, pkg: 'UAE' },
  { name: 'Singapore', lat: 1.35, lon: 103.81, pkg: 'Singapore' },
  { name: 'Kuala Lumpur', lat: 3.13, lon: 101.68, pkg: 'Malaysia' },
  { name: 'Bangkok', lat: 13.75, lon: 100.50, pkg: 'Thailand' },
  { name: 'Pattaya', lat: 12.92, lon: 100.87, pkg: 'Thailand' },
  { name: 'Bali', lat: -8.65, lon: 115.21, pkg: 'Indonesia' },
  { name: 'Paris', lat: 48.85, lon: 2.35, pkg: 'Europe' },
  { name: 'Swiss Alps', lat: 46.81, lon: 8.22, pkg: 'Europe' },
  { name: 'Rome', lat: 41.90, lon: 12.49, pkg: 'Europe' },
  { name: 'Maldives', lat: 3.20, lon: 73.22, pkg: 'Maldives' },
  { name: 'Hanoi', lat: 21.02, lon: 105.83, pkg: 'Vietnam' },
  { name: 'Istanbul', lat: 41.00, lon: 28.97, pkg: 'Turkey' },
]

function Earth({ scrollY = 0, scale = 1.75, mobile = false }: { scrollY?: number, scale?: number, mobile?: boolean }) {
  const globeRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const markersRef = useRef<THREE.Group>(null)

  // Real Earth texture – with fallback
  const [earthMap] = useTexture([
    'https://unpkg.com/three-globe@2.32.0/example/img/earth-blue-marble.jpg'
  ])

  if (earthMap) {
    earthMap.colorSpace = THREE.SRGBColorSpace
    earthMap.anisotropy = mobile ? 2 : 4
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Freeze continuous spin on mobile/reduced to save battery; still react to scroll.
    const spin = mobile ? 0 : t * 0.12
    const baseRotate = spin + scrollY * 0.8
    if (globeRef.current) globeRef.current.rotation.y = baseRotate
    if (cloudsRef.current) cloudsRef.current.rotation.y = baseRotate * 1.08
    if (markersRef.current) markersRef.current.rotation.y = baseRotate
  })

  const r = scale
  const markers = useMemo(() => DESTINATIONS.map(d => ({
    ...d,
    pos: latLonToVec(d.lat, d.lon, r + 0.035)
  })), [r])

  const seg = mobile ? 48 : 96

  return (
    <group>
      {/* Earth */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[r, seg, seg]} />
        {earthMap ? (
          <meshStandardMaterial map={earthMap} roughness={0.68} metalness={0.06} />
        ) : (
          <meshStandardMaterial color="#1c6b89" roughness={0.5} metalness={0.1} />
        )}
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[r * 1.012, mobile ? 32 : 64, mobile ? 32 : 64]} />
        <meshStandardMaterial color="white" transparent opacity={0.065} depthWrite={false} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[r * 1.2, mobile ? 32 : 64, mobile ? 32 : 64]} />
        <meshBasicMaterial color="#7fdfff" transparent opacity={0.045} side={THREE.BackSide} />
      </mesh>

      {/* Destination pins */}
      <group ref={markersRef}>
        {markers.map((d) => (
          <group key={d.name} position={d.pos}>
            <mesh position={[0,0.025,0]}>
              <coneGeometry args={[0.012, 0.055, 6]} />
              <meshBasicMaterial color="#ff7a2a" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.022, 14, 14]} />
              <meshBasicMaterial color="#ffc56c" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.048, 14, 14]} />
              <meshBasicMaterial color="#ffb24a" transparent opacity={0.22} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Orbit rings */}
      <mesh rotation={[Math.PI/2.4, 0, 0]}>
        <ringGeometry args={[r+0.6, r+0.612, 128]} />
        <meshBasicMaterial color="#9edff5" transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI/2.9, 0.7, 0]}>
        <ringGeometry args={[r+0.8, r+0.812, 128]} />
        <meshBasicMaterial color="#ffd59a" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function FlyingFleet({ globeR = 1.75, mobile = false }: { globeR?: number, mobile?: boolean }) {
  const g1 = useRef<THREE.Group>(null)
  const g2 = useRef<THREE.Group>(null)
  const g3 = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const rs = [globeR + 0.67, globeR + 0.87, globeR + 1.07]
    ;[g1, g2, g3].forEach((ref, i) => {
      if (!ref.current) return
      const r = rs[i]
      const speed = 0.35 + i * 0.11
      const ti = t * speed + i * 1.9
      ref.current.position.x = Math.cos(ti) * r
      ref.current.position.z = Math.sin(ti) * r
      ref.current.position.y = Math.sin(ti * 1.7) * 0.32
      ref.current.rotation.y = -ti - Math.PI / 2
    })
  })
  const Plane = () => (
    <mesh>
      <coneGeometry args={[0.035, 0.155, 6]} />
      <meshStandardMaterial color="#fff8f0" emissive="#ff8a2a" emissiveIntensity={0.22} />
    </mesh>
  )
  // On mobile keep just one orbiting plane to reduce draw calls.
  const fleets = mobile ? [g1] : [g1, g2, g3]
  return <>
    {fleets.map((ref, idx) => (
      <group key={idx} ref={ref}><Plane /></group>
    ))}
  </>
}

export default function Globe3D({ 
  scrollProgress = 0,
  fill = false
}: { 
  scrollProgress?: number,
  fill?: boolean
}) {
  const isMobile = useIsMobile()
  const reduced = prefersReducedMotion()
  // Hero full-bleed mode uses a larger globe and pulled-back camera
  const globeScale = fill ? 2.38 : 1.75
  const cameraZ = fill ? 5.55 : 5.1
  const fov = fill ? 38 : 42
  // Cap device pixel ratio harder on mobile to cut GPU/load cost.
  const dpr: [number, number] = isMobile ? [1, 1.3] : [1, 1.8]
  // Reduced-motion: stop the autorotate/animation by locking progress.
  const effectiveProgress = reduced ? 0 : scrollProgress

  return (
    <div className={fill ? "absolute inset-0 w-full h-full" : "w-full h-[480px] md:h-[600px] lg:h-[660px] relative"}>
      <Canvas camera={{ position: [0, 0, cameraZ], fov }} dpr={dpr} gl={{ alpha: true, antialias: !isMobile }}>
        <ambientLight intensity={0.92} />
        <directionalLight position={[5, 3, 5]} intensity={1.35} />
        <pointLight position={[-5, -2, -4]} intensity={0.42} color="#ffc27a" />
        {/* Only show starfield in non-fill (boxed) mode – in fill mode the page gradient is the background, keeping the earth perfectly round with no boxy starfield */}
        {!fill && !isMobile && <Stars radius={90} depth={40} count={3200} factor={2.4} fade speed={0.55} />}
        <Earth scrollY={effectiveProgress} scale={globeScale} mobile={isMobile} />
        <FlyingFleet globeR={globeScale} mobile={isMobile} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} rotateSpeed={0.4} minPolarAngle={Math.PI / 2.8} maxPolarAngle={Math.PI / 1.6} />
      </Canvas>
      {/* soft circular vignette – keeps the globe feeling round, no hard box edges */}
      <div className="pointer-events-none absolute inset-0"
        style={{
          background: fill
            ? 'radial-gradient(ellipse 78% 78% at 62% 52%, transparent 38%, rgba(235,248,252,0.22) 68%, rgba(235,248,252,0.55) 100%)'
            : 'radial-gradient(ellipse_at_center,transparent_45%,rgba(233,246,255,0.18)_75%,rgba(233,246,255,0.55)_100%)'
        }}
      />
      {!fill && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-[#2b5d68] bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-cyan-100 shadow-sm">
          {DESTINATIONS.length} Paryatan destinations plotted • drag to spin
        </div>
      )}
      {fill && (
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-10 text-[11px] text-[#2b5d68] bg-white/82 backdrop-blur px-3 py-1.5 rounded-full border border-cyan-100/90 shadow-sm pointer-events-none">
          Drag to spin • Scroll to explore
        </div>
      )}
    </div>
  )
}

export { DESTINATIONS }
