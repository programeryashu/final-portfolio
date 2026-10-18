import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useSceneTheme } from '../../lib/sceneTheme'
import type { DeviceTier } from '../../hooks/useDeviceCapability'
import type { ScenePalette } from '../../lib/sceneTheme'

/**
 * HeroScene — "the machine". An abstract developer workstation built
 * entirely from procedural geometry (no assets to load): a wireframe
 * core, orbit rings, a circuit bench with a flickering terminal
 * screen, drifting code particles and a few floating chips.
 *
 * Reacts to: cursor (whole rig leans), scroll (rotation + drift).
 * Peach point-light does the "desk lamp" work. Particle count scales
 * with device tier; motion scales down under reduced-motion.
 */


/** Rig: everything that leans with the cursor and spins with scroll. */
function Machine({ reduced, pal }: { reduced: boolean; pal: ScenePalette }) {
  const rig = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = rig.current
    if (!g) return

    // pointer parallax — eased, subtle
    const px = state.pointer.x
    const py = state.pointer.y
    g.rotation.y += (px * 0.28 - g.rotation.y) * Math.min(1, delta * 2.4)
    g.rotation.x += (-py * 0.16 - g.rotation.x) * Math.min(1, delta * 2.4)

    // scroll: the machine drifts back and rolls as you leave the hero
    const scroll = window.scrollY / Math.max(1, window.innerHeight)
    const s = reduced ? 0 : Math.min(scroll, 1.6)
    g.position.y = -s * 0.9
    g.rotation.z = s * 0.12

    if (!reduced) g.rotation.y += delta * 0.06
  })

  return (
    <group ref={rig} position={[1.6, 0.2, 0]}>
      <Core reduced={reduced} pal={pal} />
      <OrbitRings reduced={reduced} pal={pal} />
      <CircuitBench reduced={reduced} pal={pal} />
      <Chips reduced={reduced} pal={pal} />
    </group>
  )
}

/** Wireframe icosahedron core with a soft inner glow mesh. */
function Core({ reduced, pal }: { reduced: boolean; pal: ScenePalette }) {
  const outer = useRef<THREE.Mesh>(null)
  const inner = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (reduced) return
    outer.current?.rotateY(delta * 0.12)
    outer.current?.rotateX(delta * 0.05)
    inner.current?.rotateY(-delta * 0.18)
  })

  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={pal.peach} wireframe transparent opacity={0.28} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial
          color={pal.slab}
          emissive={pal.peach}
          emissiveIntensity={0.35}
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>
      <pointLight color={pal.peach} intensity={2.2} distance={5} />
    </group>
  )
}

/** Two tilted orbit rings, counter-rotating slowly. */
function OrbitRings({ reduced, pal }: { reduced: boolean; pal: ScenePalette }) {
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (reduced) return
    a.current?.rotateZ(delta * 0.1)
    b.current?.rotateX(delta * 0.14)
  })

  return (
    <group>
      <mesh ref={a} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.7, 0.006, 8, 128]} />
        <meshBasicMaterial color={pal.peach} transparent opacity={0.35} />
      </mesh>
      <mesh ref={b} rotation={[0.5, 0, Math.PI / 3]}>
        <torusGeometry args={[2.05, 0.005, 8, 128]} />
        <meshBasicMaterial color={pal.dim} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/** The "workstation": a dark slab, a raised terminal with a flickering screen. */
function CircuitBench({ reduced, pal }: { reduced: boolean; pal: ScenePalette }) {
  const screen = useRef<THREE.MeshBasicMaterial>(null)

  // code-line stripes on the terminal screen
  const lines = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        y: 0.32 - i * 0.045,
        w: 0.14 + ((i * 7919) % 17) / 60,
      })),
    [],
  )

  useFrame(({ clock }) => {
    if (reduced) return
    const t = clock.elapsedTime
    // terminal-cursor flicker with occasional blink-outs
    const flicker = 0.72 + Math.sin(t * 7.3) * 0.08 + Math.sin(t * 23.7) * 0.05
    const blink = Math.sin(t * 1.4) > 0.92 ? 0.25 : 1
    if (screen.current) screen.current.opacity = Math.max(0.15, flicker * blink)
  })

  return (
    <group position={[0, -1.35, 0.6]} rotation={[0.06, -0.18, 0]}>
      {/* bench slab */}
      <mesh>
        <boxGeometry args={[2.5, 0.09, 1.5]} />
        <meshStandardMaterial color={pal.slab} roughness={0.85} metalness={0.2} />
      </mesh>
      {/* PCB traces — thin emissive strips on the slab */}
      {[-0.9, -0.55, 0.7, 1.05].map((x, i) => (
        <mesh key={i} position={[x, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.02, 1.3]} />
          <meshBasicMaterial color={pal.peach} transparent opacity={0.18} />
        </mesh>
      ))}
      {/* terminal body */}
      <mesh position={[0, 0.32, -0.2]}>
        <boxGeometry args={[1.15, 0.62, 0.1]} />
        <meshStandardMaterial color={pal.shell} roughness={0.7} metalness={0.3} />
      </mesh>
      {/* terminal screen (emissive, flickers) */}
      <mesh position={[0, 0.32, -0.14]}>
        <planeGeometry args={[0.98, 0.46]} />
        <meshBasicMaterial ref={screen} color={pal.peach} transparent opacity={0.65} />
      </mesh>
      {/* code lines on screen */}
      {lines.map((l, i) => (
        <mesh key={i} position={[-0.36 + l.w / 2, 0.32 + l.y, -0.135]}>
          <planeGeometry args={[l.w, 0.012]} />
          <meshBasicMaterial color={pal.screenLines} transparent opacity={0.75} />
        </mesh>
      ))}
      {/* keyboard block */}
      <mesh position={[0, 0.12, 0.38]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.0, 0.05, 0.32]} />
        <meshStandardMaterial color={pal.shell} roughness={0.6} />
      </mesh>
      {/* status LED */}
      <mesh position={[0.98, 0.08, -0.5]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={pal.peach} />
      </mesh>
    </group>
  )
}

/** A few floating chips/cubes around the machine. */
function Chips({ reduced, pal }: { reduced: boolean; pal: ScenePalette }) {
  const chips = useMemo(
    () => [
      { pos: [-2.2, 0.9, -0.4], scale: 0.16, speed: 1.1 },
      { pos: [2.3, 1.4, -0.8], scale: 0.12, speed: 1.6 },
      { pos: [1.9, -0.6, 0.9], scale: 0.1, speed: 1.3 },
      { pos: [-1.7, -1.1, 0.7], scale: 0.13, speed: 0.9 },
    ],
    [],
  )

  return (
    <group>
      {chips.map((c, i) => (
        <Float
          key={i}
          speed={reduced ? 0 : c.speed}
          rotationIntensity={reduced ? 0 : 0.6}
          floatIntensity={reduced ? 0 : 0.9}
        >
          <mesh position={c.pos as [number, number, number]} scale={c.scale}>
            <boxGeometry args={[1.4, 1, 0.18]} />
            <meshStandardMaterial
              color={pal.shell}
              emissive={pal.peach}
              emissiveIntensity={0.12}
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

/** Drifting particles — "code dust". Count scales with tier. */
function Particles({ count, reduced, pal }: { count: number; reduced: boolean; pal: ScenePalette }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (reduced) return
    const p = ref.current
    if (!p) return
    p.rotation.y += delta * 0.02
    p.position.y = Math.sin(p.rotation.y * 6) * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color={pal.peach} transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

export default function HeroScene({ tier }: { tier: DeviceTier }) {
  const reduced = useReducedMotion()
  const pal = useSceneTheme()
  const count = tier === 'high' ? 260 : 90

  return (
    <div className="hero__canvas" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.4, 6.2], fov: 42 }}
        dpr={[1, tier === 'high' ? 2 : 1.25]}
        gl={{ antialias: tier === 'high', powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={pal.dark ? 0.25 : 0.75} />
        <directionalLight position={[4, 6, 3]} intensity={0.5} color={pal.peach} />
        <Machine reduced={reduced} pal={pal} />
        <Particles count={count} reduced={reduced} pal={pal} />
      </Canvas>
    </div>
  )
}
