import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { SimNode } from '#/components/skills/SkillsGraph'

type Props = {
  nodes: SimNode[]
  isVisible: React.RefObject<boolean>
}

export default function EdgeLines({ nodes, isVisible }: Props) {
  const linesRef = useRef<THREE.LineSegments>(null)
  const geoRef = useRef<THREE.BufferGeometry>(null)

  const skillNodes = useMemo(() => nodes.filter(n => !n.isAnchor), [nodes])
  const count = skillNodes.length

  const [posAttr, colAttr] = useMemo(() => {
    const pos = new THREE.Float32BufferAttribute(new Float32Array(count * 6), 3)
    const col = new THREE.Float32BufferAttribute(new Float32Array(count * 6), 3)
    pos.setUsage(THREE.DynamicDrawUsage)
    col.setUsage(THREE.DynamicDrawUsage)
    return [pos, col]
  }, [count])

  useFrame(() => {
    if (!isVisible.current || !geoRef.current) return

    const anchors: Record<string, SimNode> = {}
    for (const n of nodes) {
      if (n.isAnchor) anchors[n.category] = n
    }

    for (let i = 0; i < skillNodes.length; i++) {
      const skill = skillNodes[i]
      const anchor = anchors[skill.category]
      if (!anchor) continue
      const [r, g, b] = skill.categoryColor

      posAttr.setXYZ(i * 2, skill.x ?? 0, skill.y ?? 0, skill.z)
      posAttr.setXYZ(i * 2 + 1, anchor.x ?? 0, anchor.y ?? 0, anchor.z)
      colAttr.setXYZ(i * 2, r, g, b)
      colAttr.setXYZ(i * 2 + 1, r, g, b)
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true

    geoRef.current.setAttribute('position', posAttr)
    geoRef.current.setAttribute('color', colAttr)
    geoRef.current.setDrawRange(0, skillNodes.length * 2)
  })

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry ref={geoRef} />
      <lineBasicMaterial vertexColors transparent opacity={0.3} depthWrite={false} />
    </lineSegments>
  )
}
