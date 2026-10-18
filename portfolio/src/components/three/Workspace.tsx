import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useSceneTheme, type ScenePalette } from '../../lib/sceneTheme'

/**
 * Workspace — the About-section developer desk, fully procedural:
 * laptop with a softly flickering code screen, a mug, floating
 * sticky notes and a warm peach desk lamp. Leans gently toward the
 * cursor. Nothing heavy: a handful of boxes, cylinders and planes.
 */


function Desk({ reduced, pal }: { reduced: boolean; pal: ScenePalette }) {
  const rig = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = rig.current
    if (!g) return
    g.rotation.y += (state.pointer.x * 0.22 - g.rotation.y) * Math.min(1, delta * 2)
    g.rotation.x += (state.pointer.y * 0.08 - g.rotation.x) * Math.min(1, delta * 2)
  })

  return (
    <group ref={rig} position={[0, -0.55, 0]}>
      <Laptop reduced={reduced} pal={pal} />
      {/* desk slab */}
      <mesh position={[0, -0.18, 0.2]}>
        <boxGeometry args={[3.4, 0.08, 1.7]} />
        <meshStandardMaterial color={pal.slab} roughness={0.9} />
      </mesh>
      {/* mug */}
      <group position={[1.05, 0.05, 0.45]}>
        <mesh>
          <cylinderGeometry args={[0.11, 0.1, 0.2, 20]} />
          <meshStandardMaterial color={pal.shell} roughness={0.6} />
        </mesh>
        <mesh position={[0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.055, 0.014, 8, 24]} />
          <meshStandardMaterial color={pal.shell} roughness={0.6} />
        </mesh>
      </group>
      {/* sticky notes */}
      <Float speed={reduced ? 0 : 1.2} floatIntensity={reduced ? 0 : 0.35} rotationIntensity={0.2}>
        <mesh position={[-1.25, 0.1, 0.5]} rotation={[0, 0.3, 0.04]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color={pal.peach} transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      </Float>
      <Float speed={reduced ? 0 : 0.9} floatIntensity={reduced ? 0 : 0.4} rotationIntensity={0.25}>
        <mesh position={[-1.05, 0.35, 0.1]} rotation={[0, -0.2, -0.05]}>
          <planeGeometry args={[0.18, 0.18]} />
          <meshBasicMaterial color={pal.peach} transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>
      </Float>
    </group>
  )
}

function Laptop({ reduced, pal }: { reduced: boolean; pal: ScenePalette }) {
  const screenMat = useRef<THREE.MeshBasicMaterial>(null)
  const lines = [
    { y: 0.16, w: 0.5 },
    { y: 0.1, w: 0.34 },
    { y: 0.04, w: 0.44 },
    { y: -0.02, w: 0.26 },
    { y: -0.08, w: 0.4 },
    { y: -0.14, w: 0.18 },
  ]

  useFrame(({ clock }) => {
    if (reduced) return
    const t = clock.elapsedTime
    if (screenMat.current) {
      screenMat.current.opacity = 0.62 + Math.sin(t * 5.1) * 0.06
    }
  })

  return (
    <group position={[-0.1, 0.16, 0]} rotation={[0, 0.18, 0]}>
      {/* base */}
      <mesh position={[0, -0.02, 0.14]}>
        <boxGeometry args={[1.5, 0.05, 1.0]} />
        <meshStandardMaterial color={pal.shell} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* keyboard hint */}
      <mesh position={[0, 0.008, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.2, 0.62]} />
        <meshBasicMaterial color={pal.detail} />
      </mesh>
      {/* screen part, tilted open */}
      <mesh position={[0, 0.34, -0.36]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[1.5, 0.95, 0.05]} />
        <meshStandardMaterial color={pal.shell} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* screen surface */}
      <mesh position={[0, 0.35, -0.325]} rotation={[-0.28, 0, 0]}>
        <planeGeometry args={[1.36, 0.82]} />
        <meshBasicMaterial ref={screenMat} color={pal.peach} transparent opacity={0.62} />
      </mesh>
      {/* code lines on screen */}
      {lines.map((l, i) => (
        <mesh key={i} position={[-0.62 + l.w / 2 + 0.04, 0.35 + l.y * 0.78, -0.315]} rotation={[-0.28, 0, 0]}>
          <planeGeometry args={[l.w, 0.018]} />
          <meshBasicMaterial color={pal.screenLines} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export default function Workspace() {
  const reduced = useReducedMotion()
  const pal = useSceneTheme()

  return (
    <div className="workspace__canvas" aria-hidden>
      <Canvas
        camera={{ position: [0.6, 0.9, 3.6], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* desk lamp: warm peach from upper right */}
        <pointLight position={[2.2, 2.4, 1.8]} intensity={3.2} color={pal.peach} distance={9} />
        <ambientLight intensity={pal.dark ? 0.22 : 0.9} />
        <directionalLight position={[-3, 4, 2]} intensity={0.35} />
        <Desk reduced={reduced} pal={pal} />
      </Canvas>
      <p className="workspace__caption note">the desk where things get broken and fixed</p>
    </div>
  )
}
