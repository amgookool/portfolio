import { useRef } from 'react'
import { Briefcase } from 'lucide-react'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useTransform,
  useSpring,
} from 'framer-motion'
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

const tagVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: 'spring' as const,
      stiffness: 500,
      damping: 28,
    },
  }),
}

function JobCard({ job, index }: { job: (typeof jobs)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const rotateX = useTransform(my, [0, 1], [4, -4])
  const rotateY = useTransform(mx, [0, 1], [-4, 4])
  const sRotX = useSpring(rotateX, { stiffness: 280, damping: 28 })
  const sRotY = useSpring(rotateY, { stiffness: 280, damping: 28 })

  const spotX = useTransform(mx, [0, 1], ['0%', '100%'])
  const spotY = useTransform(my, [0, 1], ['0%', '100%'])
  const spotlight = useMotionTemplate`radial-gradient(300px circle at ${spotX} ${spotY}, rgba(79,184,178,0.11), transparent 70%)`

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }

  function onMouseLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <ScrollReveal delay={index * 80} className="pb-12 last:pb-0">
      <div className="relative pb-16 last:pb-0">
        <motion.span
          className="absolute -left-11.25 top-2 h-3.5 w-3.5 rounded-full border-2 border-(--lagoon) bg-(--bg-base)"
          whileHover={{
            scale: 1.7,
            boxShadow: '0 0 0 5px rgba(79,184,178,0.22)',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
        />

        <motion.div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{
            rotateX: sRotX,
            rotateY: sRotY,
            transformPerspective: 800,
          }}
          whileHover={{
            y: -3,
            boxShadow: '0 10px 35px rgba(0,0,0,0.12)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative overflow-hidden rounded-xl border border-(--line) bg-(--surface) p-5 shadow-sm hover:border-(--lagoon) transition-colors duration-200"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ background: spotlight }}
          />

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
          <motion.div
            className="mt-5 flex flex-wrap gap-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
          >
            {job.tech.map((t, i) => (
              <motion.span
                key={t}
                custom={i}
                variants={tagVariants}
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="cursor-default rounded-full border border-(--line) bg-(--fg-soft) px-3 py-1 text-xs font-medium text-(--sea-ink-soft) hover:border-(--lagoon) hover:text-(--lagoon) transition-colors duration-150"
              >
                {t}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </ScrollReveal>
  )
}

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
          <JobCard key={job.company} job={job} index={i} />
        ))}
      </div>
    </Section>
  )
}
