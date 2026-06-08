import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'
import SkillsShowcase from '#/components/skills/SkillsShowcase'

export default function SkillsSection() {
  return (
    <Section id="skills">
      <ScrollReveal>
        <SectionHeader eyebrow="Expertise" title="Technical Skills" className="pb-2" />
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <SkillsShowcase />
      </ScrollReveal>
    </Section>
  )
}
