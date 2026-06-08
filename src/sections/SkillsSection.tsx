import { Code2, Cpu, Layers } from 'lucide-react'
import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'

const skillGroups: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: string[]
}[] = [
  {
    label: 'Languages',
    icon: Code2,
    items: [
      'TypeScript',
      'JavaScript',
      'Java',
      'Dart',
      'Python',
      'SQL / NoSQL',
      'C / C++',
      'Rust',
      'Bash',
    ],
  },
  {
    label: 'Frameworks & Libraries',
    icon: Cpu,
    items: [
      'Node.js',
      'Express',
      'SvelteKit',
      'React',
      'Angular',
      'Spring Boot',
      'Flutter',
      'Tailwind CSS',
      'jQuery',
      'Thymeleaf',
    ],
  },
  {
    label: 'Infrastructure & Cloud',
    icon: Layers,
    items: [
      'Docker',
      'GCP',
      'AWS',
      'Firebase',
      'Firestore',
      'PostgreSQL',
      'MongoDB',
      'GitHub Actions',
      'Git',
    ],
  },
]

export default function SkillsSection() {
  return (
    <Section id="skills">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Expertise"
          title="Technical Skills"
          className="pb-8"
        />
      </ScrollReveal>

      <div className="grid gap-6 md:grid-cols-3">
        {skillGroups.map((group, i) => (
          <ScrollReveal key={group.label} delay={i * 80}>
            <div className="island-shell overflow-hidden rounded-2xl">
              <div className="flex items-center gap-3 border-b border-(--line) px-5 py-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--accent-soft) text-(--lagoon)">
                  <group.icon className="h-4 w-4" />
                </span>
                <h3 className="font-bold text-(--sea-ink)">{group.label}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 p-5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-(--line) bg-(--fg-soft) px-2.5 py-1 text-xs font-medium text-(--sea-ink-soft)"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  )
}
