import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code2,
  Cpu,
  Layers,
  Send,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react'
import HeroCanvas from '#/components/HeroCanvas'
import ScrollReveal from '#/components/ScrollReveal'

export const Route = createFileRoute('/')({ component: App })

// ── data ─────────────────────────────────────────────────────────────────────

const stats: {
  value: string
  label: string
}[] = [
  { value: '3+', label: 'Years of experience' },
  { value: '3', label: 'Companies worked at' },
  { value: '10+', label: 'Technologies mastered' },
  { value: 'BSc', label: 'Electrical & Computer Eng.' },
]

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
    tech: ['Node.js', 'Express', 'SvelteKit', 'React', 'Flutter', 'Firebase', 'GCP', 'Docker', 'GitHub Actions'],
  },
  {
    company: 'Agostini Innovation Lab',
    role: 'Frontend Developer',
    period: 'October 2024 – June 2026',
    location: 'Aranguez, Trinidad',
    description:
      'Developed and optimised the primary client data dashboard, achieving significantly faster load times. Refactored legacy codebase layouts into modern, reusable components with complete state coordination across Svelte and React codebases.',
    tech: ['SvelteKit', 'React', 'Flutter', 'Tailwind CSS', 'Firebase', 'GCP', 'Figma'],
  },
  {
    company: 'Mondeum Internal Service Center',
    role: 'Junior Software Developer',
    period: 'August 2023 – August 2024',
    location: 'Port-of-Spain, Trinidad',
    description:
      'Engineered system automation scripts to eliminate repetitive workflow overhead. Modified legacy structures to adapt to new APIs, troubleshoot databases, and maintain core Spring Boot applications.',
    tech: ['Java', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Angular', 'TypeScript', 'AWS'],
  },
]

const skillGroups: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  items: string[]
}[] = [
  {
    label: 'Languages',
    icon: Code2,
    items: ['TypeScript', 'JavaScript', 'Java', 'Dart', 'Python', 'SQL / NoSQL', 'C / C++', 'Rust', 'Bash'],
  },
  {
    label: 'Frameworks & Libraries',
    icon: Cpu,
    items: ['Node.js', 'Express', 'SvelteKit', 'React', 'Angular', 'Spring Boot', 'Flutter', 'Tailwind CSS', 'jQuery', 'Thymeleaf'],
  },
  {
    label: 'Infrastructure & Cloud',
    icon: Layers,
    items: ['Docker', 'GCP', 'AWS', 'Firebase', 'Firestore', 'PostgreSQL', 'MongoDB', 'GitHub Actions', 'Git'],
  },
]

type Filter = 'all' | 'web' | 'games'

const projects: {
  title: string
  description: string
  tech: string[]
  category: Filter
  badge: string
  thumb: 'portfolio' | 'pong' | 'ttt'
  link?: string
}[] = [
  {
    title: 'Personal Portfolio Website',
    description:
      'Fully responsive, performant personal showcase site built with React and Tailwind CSS. Features a clean modern design with sections for resume, projects, and contact.',
    tech: ['React', 'Tailwind CSS', 'TypeScript', 'TanStack'],
    category: 'web',
    badge: 'Web App',
    thumb: 'portfolio',
  },
  {
    title: 'Game of Pong',
    description:
      'Canvas-based Pong built with TypeScript and Svelte. Features custom collision boxes, boundary physics, game state management, and start/reset screens.',
    tech: ['TypeScript', 'Svelte', 'Canvas API'],
    category: 'games',
    badge: 'Game',
    thumb: 'pong',
  },
  {
    title: 'Tic Tac Toe',
    description:
      'Modular implementation with automatic win detection, draw calculations, and visually responsive grids. Built using Svelte and Tailwind CSS.',
    tech: ['Svelte', 'Tailwind CSS', 'HTML5'],
    category: 'games',
    badge: 'Game',
    thumb: 'ttt',
  },
]

// ── project thumbnail components ──────────────────────────────────────────────

function ThumbPortfolio() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0a1418,#0f1d22)]">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 22px,#4fb8b2 22px,#4fb8b2 23px),repeating-linear-gradient(90deg,transparent,transparent 22px,#4fb8b2 22px,#4fb8b2 23px)',
        }}
      />
      <span className="relative z-10 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-[#4fb8b2]">
        Portfolio System
      </span>
    </div>
  )
}

function ThumbPong() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
      <div className="absolute left-[18%] top-1/2 h-14 w-1.5 -translate-y-1/2 rounded-sm bg-white" />
      <div className="absolute right-[18%] top-1/2 h-14 w-1.5 -translate-y-1/2 rounded-sm bg-white" />
      <div className="absolute left-[52%] top-[42%] h-2.5 w-2.5 rounded-full bg-white" />
      <span className="relative z-10 mt-20 font-mono text-[10px] font-bold tracking-widest uppercase text-white/60">
        Pong
      </span>
    </div>
  )
}

const TTT_MARKS = ['X', 'O', 'X', 'O', 'X', '', '', 'O', 'X']

function ThumbTtt() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#14152a,#1a1b38)]">
      <div className="grid grid-cols-3 gap-0.75">
        {TTT_MARKS.map((mark, i) => (
          <div
            key={i}
            className="flex h-7 w-7 items-center justify-center rounded-sm bg-white/10 text-xs font-bold text-white"
          >
            {mark}
          </div>
        ))}
      </div>
    </div>
  )
}

const thumbComponents = { portfolio: ThumbPortfolio, pong: ThumbPong, ttt: ThumbTtt }

// ── small shared components ───────────────────────────────────────────────────

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
        active ? 'bg-(--lagoon) text-white shadow-sm' : 'text-(--sea-ink-soft) hover:text-(--sea-ink)'
      }`}
    >
      {label}
    </button>
  )
}

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-(--line) py-16 sm:py-24">
      <div className="page-wrap px-4">{children}</div>
    </section>
  )
}

function SectionHeader({ eyebrow, title, className }: { eyebrow: string; title: string; className?: string }) {
  return (
    <div className={`mb-10 ${className}`}>
      <p className="island-kicker mb-2">{eyebrow}</p>
      <h2 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">{title}</h2>
    </div>
  )
}

// ── main page ─────────────────────────────────────────────────────────────────

function App() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const filtered = activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    }
  }

  return (
    <main>
      {/* ══ HERO ═════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <HeroCanvas />

        {/* fade-out at bottom so stats bar reads clearly */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-52"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-base))' }}
        />

        {/* main content */}
        <div className="page-wrap relative z-10 flex flex-1 flex-col justify-center px-4 pt-24 pb-8">
          <div className="rise-in max-w-3xl space-y-8">
            {/* availability pills */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--accent-soft) px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase text-(--lagoon)">
                <span className="h-2 w-2 animate-pulse rounded-full bg-(--lagoon)" />
                Available for full-time roles
              </span>
              <span className="inline-flex items-center rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase text-(--sea-ink-soft)">
                Trinidad &amp; Tobago
              </span>
            </div>

            {/* headline */}
            <h1 className="display-title text-5xl font-extrabold leading-[1.04] tracking-tight text-(--sea-ink) sm:text-6xl lg:text-7xl">
              Building scalable systems,{' '}
              <span className="text-(--lagoon-deep)">architecting solid products.</span>
            </h1>

            {/* lead text */}
            <p className="max-w-[54ch] text-lg leading-relaxed text-(--sea-ink-soft) pt-4">
              Hi, I&rsquo;m Adrian — a Software Engineer specializing in backend architecture, frontend UX,
              and systems engineering. Currently crafting health-tech software at{' '}
              <span className="font-semibold text-(--sea-ink)">Dolphin Health</span>.
            </p>

            {/* CTAs + socials */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-(--sea-ink) px-6 py-3 text-sm font-bold text-(--foam) shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Get in Touch
              </a>
              <a
                href="#experience"
                className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--surface) px-6 py-3 text-sm font-bold text-(--sea-ink) transition hover:-translate-y-0.5 hover:border-(--sea-ink-soft)"
              >
                Explore Work
              </a>

              <div className="flex gap-2 pl-1">
                <a
                  href="https://github.com/amgookool"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--line) bg-(--chip-bg) text-(--sea-ink-soft) transition hover:border-(--lagoon) hover:text-(--lagoon)"
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/adrian-gookool-88a430198"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-(--line) bg-(--chip-bg) text-(--sea-ink-soft) transition hover:border-(--lagoon) hover:text-(--lagoon)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* stats bar */}
        <div className="page-wrap relative z-10 px-4 pb-14">
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-(--line) bg-(--line) sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="cursor-default bg-(--surface) px-6 py-5 transition hover:bg-(--surface2)">
                  <p className="display-title text-4xl font-extrabold tracking-tight text-(--sea-ink)">{s.value}</p>
                  <p className="mt-1 text-xs font-medium text-(--sea-ink-soft)">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* scroll indicator */}
        <a
          href="#about"
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 animate-bounce text-(--sea-ink-soft) transition hover:text-(--lagoon)"
          aria-label="Scroll down"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </section>

      {/* ══ ABOUT ════════════════════════════════════════════════════════ */}
      <Section id="about">
        <div className="grid gap-12 md:grid-cols-3 md:gap-16">
          <ScrollReveal className="md:col-span-2 space-y-6">
            <SectionHeader eyebrow="Biography" title="Passionate about clean architecture & systems design." className='pb-2.5'/>
            <p className="text-base leading-relaxed text-(--sea-ink-soft)">
              I am a passionate software engineer dedicated to building scalable, efficient, and reliable
              software solutions. With experience across the full stack — from backend services in Node.js
              and Spring Boot to modern frontend frameworks like React, Svelte, and Angular — I enjoy taking
              ideas from concept to production.
            </p>
            <p className="text-base leading-relaxed text-(--sea-ink-soft)">
              My professional philosophy is rooted in code quality, maintainability, and elegant architecture.
              I believe that writing code is only a part of software engineering; designing systems that can
              grow, adapt, and handle loads gracefully is where the true value lies.
            </p>
            <p className="text-base leading-relaxed text-(--sea-ink-soft)">
              As a lifelong learner, I am constantly exploring the ever-evolving landscapes of technology,
              including AI agentic workflows and modern containerization. I thrive in collaborative,
              cross-functional team environments where we build premium user experiences together.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={120} className="rise-in pt-2">
            <div className="island-shell rounded-2xl p-6">
              <p className="island-kicker mb-4">Quick Facts</p>
              {[
                { label: 'Location', value: 'St. Augustine, T&T', icon: MapPin },
                { label: 'Email', value: 'amgookool@gmail.com', href: 'mailto:amgookool@gmail.com', icon: Mail },
                { label: 'Phone', value: '+1 (868) 475-5372', href: 'tel:+18684755372', icon: Phone },
                { label: 'Work mode', value: 'Remote & On-site', icon: Briefcase },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 border-b border-(--line) py-3 last:border-0"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--accent-soft) text-(--lagoon)">
                    <item.icon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-(--sea-ink-soft)">{item.label}</p>
                    {'href' in item && item.href ? (
                      <a href={item.href} className="text-sm font-medium text-(--sea-ink) transition hover:text-(--lagoon-deep)">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-(--sea-ink)">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ══ EXPERIENCE ═══════════════════════════════════════════════════ */}
      <Section id="experience">
        <ScrollReveal>
          <SectionHeader eyebrow="Career Journey" title="Work Experience" className='pb-4'/>
        </ScrollReveal>

        <div className="mt-12 border-l border-(--line) pl-10">
          {jobs.map((job, i) => (
            <ScrollReveal key={job.company} delay={i * 80} className="pb-12 last:pb-0">
              <div className="relative pb-16 last:pb-0">
                {/* dot */}
                <span className="absolute -left-11.25 top-2 h-3.5 w-3.5 rounded-full border-2 border-(--lagoon) bg-(--bg-base)" />

                <span className="font-mono text-xs font-medium tracking-wide text-(--sea-ink-soft)">{job.period}</span>
                <h3 className="mt-2 flex items-center gap-2 text-xl font-bold text-(--sea-ink)">
                  <Briefcase className="h-4 w-4 shrink-0 text-(--lagoon)" />
                  {job.role}
                </h3>
                <p className="mt-1 text-sm font-semibold text-(--lagoon-deep)">
                  {job.company} &middot; {job.location}
                </p>
                <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-(--sea-ink-soft)">{job.description}</p>
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

      {/* ══ SKILLS ═══════════════════════════════════════════════════════ */}
      <Section id="skills">
        <ScrollReveal>
          <SectionHeader eyebrow="Expertise" title="Technical Skills"  className='pb-8'/>
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

      {/* ══ EDUCATION ════════════════════════════════════════════════════ */}
      <Section id="education">
        <ScrollReveal>
          <SectionHeader eyebrow="Academic Background" title="Education" className="pb-8"/>
        </ScrollReveal>

        <ScrollReveal delay={80} className="max-w-2xl">
          <div className="island-shell rounded-2xl p-6 sm:p-8">
            <div className="flex gap-5">
              <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--accent-soft) text-(--lagoon)">
                <GraduationCap className="h-6 w-6" />
              </span>
              <div className="space-y-1.5">
                <span className="font-mono text-xs text-(--sea-ink-soft)">September 2019 – June 2023</span>
                <h3 className="text-lg font-bold leading-snug text-(--sea-ink)">
                  BSc Electrical &amp; Computer Engineering (Honours)
                </h3>
                <p className="text-sm font-semibold text-(--lagoon-deep)">
                  The University of the West Indies, St. Augustine &middot; Trinidad and Tobago
                </p>
                <p className="mt-3 text-sm leading-relaxed text-(--sea-ink-soft)">
                  Four-year honours programme covering digital systems design, embedded computing, software
                  engineering principles, signal processing, and advanced mathematics — providing a rigorous
                  foundation for systems-level and full-stack software development.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Digital Systems', 'Embedded Computing', 'Software Engineering', 'Signal Processing'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-(--line) bg-(--fg-soft) px-2.5 py-0.5 text-xs font-medium text-(--sea-ink-soft)"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* ══ PROJECTS ═════════════════════════════════════════════════════ */}
      <Section id="projects">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-8">
          <ScrollReveal>
            <SectionHeader eyebrow="Work Showcase" title="Projects"/>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="flex self-start rounded-lg border border-(--line) bg-(--surface2) p-1">
              {(['all', 'web', 'games'] as Filter[]).map((f) => (
                <FilterBtn key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
              ))}
            </div>
          </ScrollReveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => {
            const Thumb = thumbComponents[project.thumb]
            return (
              <ScrollReveal key={project.title} delay={i * 70}>
                <article className="island-shell feature-card flex flex-col overflow-hidden rounded-2xl min-h-fit">
                  <div className="aspect-video overflow-hidden">
                    <Thumb />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-(--sea-ink)">{project.title}</h3>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="rounded-full bg-(--accent-soft) px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-(--lagoon)">
                          {project.badge}
                        </span>
                        {project.link && project.link !== '#' && (
                          <a href={project.link} className="text-(--lagoon) transition hover:text-(--lagoon-deep)">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-(--sea-ink-soft)">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-(--line) bg-(--fg-soft) px-2 py-0.5 font-mono text-[10px] font-semibold text-(--sea-ink-soft)"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            )
          })}
        </div>
      </Section>

      {/* ══ CONTACT ══════════════════════════════════════════════════════ */}
      <Section id="contact">
        <div className="grid gap-12 md:grid-cols-5">
          {/* contact info */}
          <ScrollReveal className="md:col-span-2 space-y-8">
            <div>
              <SectionHeader eyebrow="Collaboration" title="Let's build something exceptional together." className='pb-2.5'/>
              <p className="text-sm leading-relaxed text-(--sea-ink-soft)">
                Open to discussing new engineering roles, backend architecture challenges, frontend designs,
                or contract positions. Leave a message or reach out directly!
              </p>
            </div>

            <div>
              {[
                { icon: Mail, value: 'amgookool@gmail.com', href: 'mailto:amgookool@gmail.com' },
                { icon: Phone, value: '+1 (868) 475-5372', href: 'tel:+18684755372' },
                { icon: MapPin, value: 'Trinidad & Tobago', href: undefined },
              ].map((item) => (
                <div key={item.value} className="flex items-center gap-3 border-b border-(--line) py-3.5 last:border-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--line) bg-(--chip-bg) text-(--lagoon)">
                    <item.icon className="h-4 w-4" />
                  </span>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium text-(--sea-ink-soft) transition hover:text-(--lagoon-deep)">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-(--sea-ink-soft)">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* form */}
          <ScrollReveal delay={100} className="md:col-span-3">
            <div className="island-shell rounded-2xl p-6 sm:p-8">
              {formSubmitted ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-(--accent-soft) text-(--lagoon-deep)">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-(--sea-ink)">Message Sent!</h3>
                    <p className="mt-1.5 text-sm text-(--sea-ink-soft)">
                      Thank you for reaching out — I&rsquo;ll get back to you as soon as possible.
                    </p>
                  </div>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-2 rounded-full border border-(--line) bg-(--surface2) px-5 py-2.5 text-sm font-semibold text-(--sea-ink) transition hover:-translate-y-0.5"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="mb-2 text-lg font-bold text-(--sea-ink) pb-2">Send a Message</h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="field">
                      <label htmlFor="name">Your Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input"
                        placeholder="Adrian Gookool"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="field py-2.5">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="textarea"
                      placeholder="Hi Adrian, let's collaborate on..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--accent-soft) px-6 py-3 text-sm font-bold text-(--lagoon-deep) transition hover:-translate-y-0.5 hover:bg-(--accent-mid)"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </Section>
    </main>
  )
}
