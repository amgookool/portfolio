import { Briefcase } from 'lucide-react'
import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'

const jobs: {
  company: string
  role: string
  period: string
  location: string
  description: string
  tech: string[]
}[] = [
  {
    company: 'Dolphin Health',
    role: 'Software Engineer',
    period: 'July 2026 – Present',
    location: 'Port-of-Spain, Trinidad',
    description:
      'Collaborating with cross-functional teams to design, develop, and maintain secure, high-performance health services. Architecting robust backend modules, conducting code reviews, and automating operational workflows with AI tooling.',
    tech: [
      'Node.js',
      'Express',
      'SvelteKit',
      'React',
      'Flutter',
      'Firebase',
      'GCP',
      'Docker',
      'GitHub Actions',
    ],
  },
  {
    company: 'Agostini Innovation Lab',
    role: 'Frontend Developer',
    period: 'October 2024 – June 2026',
    location: 'Aranguez, Trinidad',
    description:
      'Developed and optimised the primary client data dashboard, achieving significantly faster load times. Refactored legacy codebase layouts into modern, reusable components with complete state coordination across Svelte and React codebases.',
    tech: [
      'SvelteKit',
      'React',
      'Flutter',
      'Tailwind CSS',
      'Firebase',
      'GCP',
      'Figma',
    ],
  },
  {
    company: 'Mondeum Internal Service Center',
    role: 'Junior Software Developer',
    period: 'August 2023 – August 2024',
    location: 'Port-of-Spain, Trinidad',
    description:
      'Engineered system automation scripts to eliminate repetitive workflow overhead. Modified legacy structures to adapt to new APIs, troubleshoot databases, and maintain core Spring Boot applications.',
    tech: [
      'Java',
      'Spring Boot',
      'PostgreSQL',
      'MongoDB',
      'Angular',
      'TypeScript',
      'AWS',
    ],
  },
]

export default function ExperienceSection() {
  return (
    <Section id="experience">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Career Journey"
          title="Work Experience"
          className="pb-4"
        />
      </ScrollReveal>

      <div className="mt-12 border-l border-(--line) pl-10">
        {jobs.map((job, i) => (
          <ScrollReveal
            key={job.company}
            delay={i * 80}
            className="pb-12 last:pb-0"
          >
            <div className="relative pb-16 last:pb-0">
              {/* dot */}
              <span className="absolute -left-11.25 top-2 h-3.5 w-3.5 rounded-full border-2 border-(--lagoon) bg-(--bg-base)" />

              <span className="font-mono text-xs font-medium tracking-wide text-(--sea-ink-soft)">
                {job.period}
              </span>
              <h3 className="mt-2 flex items-center gap-2 text-xl font-bold text-(--sea-ink)">
                <Briefcase className="h-4 w-4 shrink-0 text-(--lagoon)" />
                {job.role}
              </h3>
              <p className="mt-1 text-sm font-semibold text-(--lagoon-deep)">
                {job.company} &middot; {job.location}
              </p>
              <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-(--sea-ink-soft)">
                {job.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {job.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-(--line) bg-(--fg-soft) px-3 py-1 text-xs font-medium text-(--sea-ink-soft)"
                  >
                    {t}
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
