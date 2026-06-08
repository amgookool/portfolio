import { useSkillsLayer } from './SkillsCanvas'
import SkillLogoView from './SkillLogoView'
import type { Skill } from '#/data/skills'

function SkillDot({ accent }: { accent: string }) {
  return (
    <span
      data-testid="skill-dot"
      className="size-1.5 rounded-full transition-transform duration-150 group-hover:scale-150"
      style={{ backgroundColor: accent }}
    />
  )
}

// Chooses what sits at the head of a skill pill: the 3D logo when the shared
// layer is active and the skill has a GLB, otherwise the colored accent dot
// (which also covers asset-less skills and the SSR / no-WebGL fallback).
export default function SkillMarker({
  skill,
  accent,
  hovered = false,
}: {
  skill: Skill
  accent: string
  hovered?: boolean
}) {
  const { active } = useSkillsLayer()

  if (active && skill.glbPath) {
    return <SkillLogoView glbPath={skill.glbPath} hovered={hovered} />
  }

  return <SkillDot accent={accent} />
}
