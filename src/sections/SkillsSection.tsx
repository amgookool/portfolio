import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'
import SkillsGraph from '#/components/skills/SkillsGraph'
import { SKILLS } from '#/data/skills'

export default function SkillsSection() {
  return (
    <Section id="skills">
      <ScrollReveal>
        <SectionHeader eyebrow="Expertise" title="Technical Skills" className="pb-8" />
      </ScrollReveal>

      <SkillsGraph />

      {/* Screen-reader accessible skill list — visually hidden */}
      <ul
        aria-label="Technical skills"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {SKILLS.map(skill => (
          <li key={skill.id}>{skill.name}</li>
        ))}
      </ul>
    </Section>
  )
}
