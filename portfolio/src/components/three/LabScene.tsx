import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useSceneTheme } from '../../lib/sceneTheme'

/**
 * LabScene — a sparse neural-net-ish graph: nodes connected by faint
 * lines, drifting slowly behind the lab cards. Deliberately quiet.
 */


function Graph({ reduced, pal }: { reduced: boolean; pal: ReturnType<typeof useSceneTheme> }) {
  const group = useRef<THREE.Group>(null)

  const { nodes, edges } = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const count = 26
    for (let i = 0; i < count; i++) {
      // loose slab shape, wider than tall
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 11,
          (Math.random() - 0.5) * 4.4,
          (Math.random() - 0.5) * 3 - 1.5,
        ),
      )
    }
    const lines: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (pts[i].distanceTo(pts[j]) < 2.6) lines.push([pts[i], pts[j]])
      }
    }
    return { nodes: pts, edges: lines }
  }, [])

  const lineGeo = useMemo(() => {
    const verts: number[] = []
    for (const [a, b] of edges) verts.push(a.x, a.y, a.z, b.x, b.y, b.z)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return g
  }, [edges])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    if (!reduced) g.rotation.y += delta * 0.03
    g.rotation.x += (state.pointer.y * 0.05 - g.rotation.x) * Math.min(1, delta * 1.5)
  })

  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={pal.peach} transparent opacity={0.5} />
        </mesh>
      ))}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={pal.peach} transparent opacity={0.08} />
      </lineSegments>
    </group>
  )
}

export default function LabScene() {
  const reduced = useReducedMotion()
  const pal = useSceneTheme()
  return (
    <div className="lab__canvas" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Graph reduced={reduced} pal={pal} />
      </Canvas>
    </div>
  )
}
