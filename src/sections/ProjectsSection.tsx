import { useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion'
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
    link: 'https://pong.amgookool.xyz',
  },
  {
    title: 'Tic Tac Toe',
    description:
      'Modular implementation with automatic win detection, draw calculations, and visually responsive grids. Built using Svelte and Tailwind CSS.',
    tech: ['Svelte', 'Tailwind CSS', 'HTML5'],
    category: 'games',
    badge: 'Game',
    thumb: 'ttt',
    link: 'https://tictactoe.amgookool.xyz',
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

// ── motion variants ───────────────────────────────────────────────────────────

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

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      type: 'spring' as const,
      stiffness: 300,
      damping: 28,
    },
  }),
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
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
      className={`relative rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
        active
          ? 'text-white'
          : 'text-(--sea-ink-soft) hover:text-(--sea-ink)'
      }`}
    >
      {active && (
        <motion.span
          layoutId="filter-pill"
          className="absolute inset-0 rounded-lg bg-(--lagoon) shadow-sm"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  )
}

// ── project card ──────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const rotateX = useTransform(my, [0, 1], [5, -5])
  const rotateY = useTransform(mx, [0, 1], [-5, 5])
  const sRotX = useSpring(rotateX, { stiffness: 280, damping: 28 })
  const sRotY = useSpring(rotateY, { stiffness: 280, damping: 28 })

  const spotX = useTransform(mx, [0, 1], ['0%', '100%'])
  const spotY = useTransform(my, [0, 1], ['0%', '100%'])
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${spotX} ${spotY}, rgba(79,184,178,0.12), transparent 70%)`

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

  const Thumb = thumbComponents[project.thumb]
  const hasLink = project.link && project.link !== '#'

  return (
    <motion.article
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        transformPerspective: 800,
      }}
      whileHover={{
        y: -5,
        boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--surface) shadow-sm hover:border-(--lagoon) transition-colors duration-200"
    >
      {/* spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
        style={{ background: spotlight }}
      />

      {/* thumbnail */}
      <motion.div
        className="aspect-video overflow-hidden"
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <Thumb />
      </motion.div>

      {/* content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-(--sea-ink)">
            {project.title}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.1 + 0.2,
                type: 'spring',
                stiffness: 400,
                damping: 22,
              }}
              className="rounded-full bg-(--accent-soft) px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-(--lagoon)"
            >
              {project.badge}
            </motion.span>
            {hasLink && (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -8 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="inline-flex items-center justify-center rounded-full p-1 text-(--lagoon) transition-colors hover:bg-(--accent-soft) hover:text-(--lagoon-deep)"
              >
                <ExternalLink className="h-4 w-4" />
              </motion.a>
            )}
          </div>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-(--sea-ink-soft)">
          {project.description}
        </p>

        {/* tech tags with stagger animation */}
        <motion.div
          className="flex flex-wrap gap-1.5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
        >
          {project.tech.map((t, i) => (
            <motion.span
              key={t}
              custom={i}
              variants={tagVariants}
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="cursor-default rounded-full border border-(--line) bg-(--fg-soft) px-2.5 py-0.5 font-mono text-[10px] font-semibold text-(--sea-ink-soft) hover:border-(--lagoon) hover:text-(--lagoon) transition-colors duration-150"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>

        {/* live demo link */}
        {hasLink && (
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.35 }}
            whileHover={{ x: 4 }}
            className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wide text-(--lagoon) transition-colors hover:text-(--lagoon-deep)"
          >
            View Live Demo
            <ExternalLink className="h-3 w-3" />
          </motion.a>
        )}
      </div>
    </motion.article>
  )
}

// ── section ───────────────────────────────────────────────────────────────────

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

      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
