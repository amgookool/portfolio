import { useState, useCallback } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import PulseRing from '#/components/skills/PulseRing'
import type { SkillCategory } from '#/data/skills'

type Props = {
  position: [number, number, number]
  category: SkillCategory
  label: string
  color: [number, number, number]
  isVisible: React.RefObject<boolean>
}

type RingInstance = { id: number; delay: number }

export default function CategoryAnchor({ position, label, color }: Props) {
  const [rings, setRings] = useState<RingInstance[]>([])

  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    const id = Date.now()
    setRings(prev => [...prev, { id, delay: 0 }, { id: id + 1, delay: 300 }])
  }, [])

  const removeRing = useCallback((id: number) => {
    setRings(prev => prev.filter(r => r.id !== id))
  }, [])

  const [r, g, b] = color.map(c => Math.round(c * 255))
  const threeColor = new THREE.Color(...color)

  return (
    <group position={position}>
      <mesh onClick={handleClick}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={0.25}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      <Html center position={[0, 2.4, 0]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily: "ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.13em',
            textTransform: 'uppercase' as const,
            color: `rgb(${r},${g},${b})`,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      </Html>

      {rings.map(ring => (
        <PulseRing
          key={ring.id}
          color={color}
          delay={ring.delay}
          duration={1000}
          startRadius={1.8}
          onDone={() => removeRing(ring.id)}
        />
      ))}
    </group>
  )
}
