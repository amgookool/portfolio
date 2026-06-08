import { Html } from '@react-three/drei'
import type { SkillCategory } from '#/data/skills'

type Props = {
  position: [number, number, number]
  name: string
  category: SkillCategory
  color: [number, number, number]
}

export default function SkillLabel({ position, name, color }: Props) {
  const [r, g, b] = color.map(c => Math.round(c * 255))
  const borderColor = `rgb(${r},${g},${b})`

  return (
    <Html center position={position} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: `1px solid ${borderColor}`,
          borderRadius: '999px',
          padding: '3px 10px',
          whiteSpace: 'nowrap',
          fontFamily: "ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace",
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: `rgb(${r},${g},${b})`,
          opacity: 1,
          transition: 'opacity 0.15s ease',
        }}
      >
        {name}
      </div>
    </Html>
  )
}
