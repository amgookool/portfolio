import { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force'
import { SKILLS, SKILL_CATEGORIES, CATEGORY_LABELS, type SkillCategory } from '#/data/skills'
import { resolveCssColor } from '#/utils/theme'
import CategoryAnchor from '#/components/skills/CategoryAnchor'
import SkillNode from '#/components/skills/SkillNode'
import EdgeLines from '#/components/skills/EdgeLines'
import SkillLabel from '#/components/skills/SkillLabel'

// Preload all GLB assets at module level so they load before the section scrolls into view
SKILLS.filter(s => s.glbPath !== null).forEach(s => useGLTF.preload(s.glbPath!))

export type SimNode = SimulationNodeDatum & {
  id: string
  isAnchor: boolean
  category: SkillCategory
  name: string
  shortName: string
  glbPath: string | null
  z: number
  vz: number
  categoryColor: [number, number, number]
}

type SimLink = SimulationLinkDatum<SimNode>
type CategoryColors = Record<SkillCategory, [number, number, number]>

const ANCHOR_STARTS: Record<SkillCategory, [number, number, number]> = {
  languages: [-9, 6, 0],
  frameworks: [9, 6, 0],
  infrastructure: [0, -10, 0],
}

const Z_SPREAD = 2.5

function resolveColors(): CategoryColors {
  return {
    languages: resolveCssColor('--lagoon'),
    frameworks: resolveCssColor('--lagoon2'),
    infrastructure: resolveCssColor('--amber'),
  }
}

function Scene({ isVisible }: { isVisible: React.RefObject<boolean> }) {
  const [nodes, setNodes] = useState<SimNode[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const simRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null)
  const colorsRef = useRef<CategoryColors>(resolveColors())

  // Re-resolve colors when the theme toggles
  useEffect(() => {
    const obs = new MutationObserver(() => {
      colorsRef.current = resolveColors()
      setNodes(prev =>
        prev.map(n => ({ ...n, categoryColor: colorsRef.current[n.category] })),
      )
    })
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  // Build nodes and start the force simulation
  useEffect(() => {
    const colors = colorsRef.current

    const anchorNodes: SimNode[] = SKILL_CATEGORIES.map(cat => ({
      id: `anchor-${cat}`,
      isAnchor: true,
      category: cat,
      name: CATEGORY_LABELS[cat],
      shortName: CATEGORY_LABELS[cat],
      glbPath: null,
      x: ANCHOR_STARTS[cat][0],
      y: ANCHOR_STARTS[cat][1],
      z: ANCHOR_STARTS[cat][2],
      vz: 0,
      categoryColor: colors[cat],
      fx: ANCHOR_STARTS[cat][0],
      fy: ANCHOR_STARTS[cat][1],
    }))

    const skillNodes: SimNode[] = SKILLS.map(skill => ({
      id: skill.id,
      isAnchor: false,
      category: skill.category,
      name: skill.name,
      shortName: skill.shortName,
      glbPath: skill.glbPath,
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 18,
      z: ANCHOR_STARTS[skill.category][2] + (Math.random() - 0.5) * Z_SPREAD,
      vz: 0,
      categoryColor: colors[skill.category],
    }))

    const allNodes = [...anchorNodes, ...skillNodes]
    const links: SimLink[] = skillNodes.map(n => ({
      source: n.id,
      target: `anchor-${n.category}`,
    }))

    const sim = forceSimulation<SimNode>(allNodes)
      .force('charge', forceManyBody<SimNode>().strength(-80))
      .force(
        'link',
        forceLink<SimNode, SimLink>(links).id(d => d.id).distance(5).strength(0.8),
      )
      .force('center', forceCenter<SimNode>(0, 0))
      .force('collide', forceCollide<SimNode>(2.5))

    let tick = 0
    sim.on('tick', () => {
      tick++

      // Release anchor fixed positions after clusters have formed
      if (tick === 200) {
        anchorNodes.forEach(n => {
          n.fx = undefined
          n.fy = undefined
        })
      }

      // Custom z spring: each node attracted toward its category anchor's z plane
      for (const n of allNodes) {
        const targetZ = ANCHOR_STARTS[n.category][2]
        n.vz = (n.vz + (targetZ - n.z) * 0.05) * 0.9
        n.z += n.vz
      }

      setNodes([...allNodes])
    })

    simRef.current = sim
    return () => { sim.stop() }
  }, [])

  const handleDragStart = useCallback(() => {
    simRef.current?.alphaTarget(0.3).restart()
  }, [])

  const handleDragEnd = useCallback(() => {
    simRef.current?.alphaTarget(0).alpha(0.3).restart()
  }, [])

  const anchorNodes = nodes.filter(n => n.isAnchor)
  const skillNodes = nodes.filter(n => !n.isAnchor)
  const hoveredNode = hoveredId ? nodes.find(n => n.id === hoveredId) : null

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[-8, 8, 5]} intensity={1.2} color="#0ea5e9" />
      <pointLight position={[8, -5, -3]} intensity={0.8} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 2 - Math.PI * (50 / 180)}
        maxPolarAngle={Math.PI / 2 + Math.PI * (50 / 180)}
        autoRotate
        autoRotateSpeed={0.3}
        makeDefault
      />

      {anchorNodes.map(n => (
        <CategoryAnchor
          key={n.id}
          position={[n.x ?? 0, n.y ?? 0, n.z]}
          category={n.category}
          label={n.name}
          color={colorsRef.current[n.category]}
          isVisible={isVisible}
        />
      ))}

      {skillNodes.map(n => (
        <SkillNode
          key={n.id}
          node={n}
          color={colorsRef.current[n.category]}
          isHovered={hoveredId === n.id}
          onHover={setHoveredId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isVisible={isVisible}
        />
      ))}

      <EdgeLines nodes={nodes} isVisible={isVisible} />

      {hoveredNode && !hoveredNode.isAnchor && (
        <SkillLabel
          position={[hoveredNode.x ?? 0, (hoveredNode.y ?? 0) + 1.8, hoveredNode.z]}
          name={hoveredNode.name}
          category={hoveredNode.category}
          color={colorsRef.current[hoveredNode.category]}
        />
      )}
    </>
  )
}

export default function SkillsGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-105 md:h-150">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene isVisible={isVisible} />
      </Canvas>
    </div>
  )
}
