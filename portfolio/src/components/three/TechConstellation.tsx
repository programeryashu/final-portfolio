import { useMemo, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import { skillCategories, type SkillItem } from '../../data/skills'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useSceneTheme, type ScenePalette } from '../../lib/sceneTheme'

/**
 * TechConstellation — the toolbox as a star chart. Each category is a
 * bright core orbited by its skill nodes (name labels via drei Text,
 * no font files to host). Hovering a node dims the rest and reports
 * the skill up to the React side for the detail panel.
 */


interface NodeDef {
  name: string
  category: string
  catLabel: string
  orbit: number
  angle0: number
  speed: number
  y: number
}

function buildNodes(): NodeDef[] {
  const nodes: NodeDef[] = []
  skillCategories.forEach((cat, ci) => {
    cat.items.forEach((item: SkillItem, ii) => {
      nodes.push({
        name: item.name,
        category: cat.id,
        catLabel: cat.label,
        orbit: 2.5 + ci * 0.9 + (ii % 2) * 0.35,
        angle0: (ii / cat.items.length) * Math.PI * 2 + ci * 0.7 + (ci % 2) * 0.35,
        speed: 0.1 + ci * 0.02 + (ii % 3) * 0.015,
        y: Math.sin(ii * 2.1 + ci) * 0.5 + (ci % 2 ? 0.3 : -0.3),
      })
    })
  })
  return nodes
}

function Constellation({ onHover, reduced, pal }: { onHover: (s: SkillItem | null) => void; reduced: boolean; pal: ScenePalette }) {
  const nodes = useMemo(buildNodes, [])
  const [hovered, setHovered] = useState<string | null>(null)
  const group = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    if (!reduced) g.rotation.y += delta * 0.05
    g.rotation.x += (state.pointer.y * 0.1 - g.rotation.x) * Math.min(1, delta * 2)
  })

  const handleOver = useCallback(
    (n: NodeDef | null) => {
      setHovered(n?.name ?? null)
      onHover(n ? { name: n.name, usedIn: USED_IN[n.name] ?? '' } : null)
    },
    [onHover],
  )

  return (
    <group ref={group}>
      {/* category cores */}
      {skillCategories.map((cat, i) => {
        const a = (i / skillCategories.length) * Math.PI * 2
        return (
          <group key={cat.id} position={[Math.cos(a) * 2.35, Math.sin(i * 2.4) * 0.9, Math.sin(a) * 2.35]}>
            <mesh>
              <sphereGeometry args={[0.16, 20, 20]} />
              <meshBasicMaterial color={pal.peach} />
            </mesh>
            <pointLight color={pal.peach} intensity={0.6} distance={2.6} />
            <Billboard position={[0, 0.42, 0]}>
              <Text fontSize={0.14} color={pal.peach} anchorX="center" letterSpacing={0.06}>
                {cat.label}
              </Text>
            </Billboard>
          </group>
        )
      })}

      {/* faint orbit rings */}
      {[2.1, 2.95, 3.8, 4.65].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.004, 6, 96]} />
          <meshBasicMaterial color={pal.dim} transparent opacity={0.35} />
        </mesh>
      ))}

      {/* skill nodes */}
      {nodes.map((n) => (
        <SkillNode
          key={n.name}
          node={n}
          dimmed={hovered !== null && hovered !== n.name}
          onOver={handleOver}
          reduced={reduced}
          pal={pal}
        />
      ))}
    </group>
  )
}

function SkillNode({
  node,
  dimmed,
  onOver,
  reduced,
  pal,
}: {
  node: NodeDef
  dimmed: boolean
  onOver: (n: NodeDef | null) => void
  reduced: boolean
  pal: ScenePalette
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const t = reduced ? 0.5 : clock.elapsedTime
    const a = node.angle0 + t * node.speed
    g.position.set(Math.cos(a) * node.orbit, node.y, Math.sin(a) * node.orbit)
  })

  return (
    <group
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation()
        onOver(node)
      }}
      onPointerOut={() => onOver(null)}
    >
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={dimmed ? pal.dim : pal.peach} transparent opacity={dimmed ? 0.4 : 1} />
      </mesh>
      <Billboard position={[0, 0.13, 0]}>
        <Text fontSize={0.11} color={dimmed ? pal.dim : pal.ink} anchorX="center">
          {node.name}
        </Text>
      </Billboard>
      {/* generous invisible hit area */}
      <mesh visible={false}>
        <sphereGeometry args={[0.22, 8, 8]} />
      </mesh>
    </group>
  )
}

/** name -> where it was actually used (mirrors data/skills.ts) */
const USED_IN: Record<string, string> = Object.fromEntries(
  skillCategories.flatMap((c) => c.items.map((i) => [i.name, i.usedIn])),
)

export default function TechConstellation({ onHover }: { onHover: (s: SkillItem | null) => void }) {
  const reduced = useReducedMotion()
  const pal = useSceneTheme()

  return (
    <div className="constellation__canvas" aria-hidden>
      <Canvas
        camera={{ position: [0, 2.2, 7.2], fov: 46 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={pal.dark ? 0.4 : 1.1} />
        <Constellation onHover={onHover} reduced={reduced} pal={pal} />
      </Canvas>
    </div>
  )
}
