import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'

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

const thumbComponents = {
  portfolio: ThumbPortfolio,
  pong: ThumbPong,
  ttt: ThumbTtt,
}

// ── filter button ─────────────────────────────────────────────────────────────

function FilterBtn({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
        active
          ? 'bg-(--lagoon) text-white shadow-sm'
          : 'text-(--sea-ink-soft) hover:text-(--sea-ink)'
      }`}
    >
      {label}
    </button>
  )
}

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <Section id="projects">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-8">
        <ScrollReveal>
          <SectionHeader eyebrow="Work Showcase" title="Projects" />
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <div className="flex self-start rounded-lg border border-(--line) bg-(--surface2) p-1">
            {(['all', 'web', 'games'] as Filter[]).map((f) => (
              <FilterBtn
                key={f}
                label={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              />
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
                    <h3 className="font-bold text-(--sea-ink)">
                      {project.title}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="rounded-full bg-(--accent-soft) px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-(--lagoon)">
                        {project.badge}
                      </span>
                      {project.link && project.link !== '#' && (
                        <a
                          href={project.link}
                          className="text-(--lagoon) transition hover:text-(--lagoon-deep)"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-(--sea-ink-soft)">
                    {project.description}
                  </p>
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
  )
}
