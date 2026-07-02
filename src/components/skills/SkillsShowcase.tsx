import { useRef, useState } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { SKILLS, SKILL_CATEGORIES, CATEGORY_LABELS } from '#/data/skills'
import type { Skill, SkillCategory } from '#/data/skills'
import SkillsLayerProvider from './SkillsCanvas'
import SkillMarker from './SkillMarker'
import SkillsPlayground from './SkillsPlayground'

// ── per-category editorial metadata ───────────────────────────────────────────

const CATEGORY_META: Record<
  SkillCategory,
  { index: string; accent: string; glow: string; blurb: string }
> = {
  languages: {
    index: '01',
    accent: 'var(--lagoon)',
    glow: 'color-mix(in oklch, var(--lagoon) 20%, transparent)',
    blurb: 'Systems & application programming',
  },
  frameworks: {
    index: '02',
    accent: 'var(--lagoon2)',
    glow: 'color-mix(in oklch, var(--lagoon2) 20%, transparent)',
    blurb: 'Interfaces, services & cross-platform',
  },
  infrastructure: {
    index: '03',
    accent: 'var(--amber)',
    glow: 'color-mix(in oklch, var(--amber) 22%, transparent)',
    blurb: 'Data, cloud & delivery pipelines',
  },
}

const COUNT_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
]

// ── motion variants ───────────────────────────────────────────────────────────

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
}

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 520, damping: 30 },
  },
}

// ── skill pill ────────────────────────────────────────────────────────────────

function SkillPill({ skill, accent }: { skill: Skill; accent: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.li variants={pillVariants} className="contents">
      <motion.span
        whileHover={{ y: -3, scale: 1.05 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
        className="group inline-flex cursor-default items-center gap-2 rounded-full border border-(--line) bg-(--surface) py-1.5 pr-4 pl-3 text-sm font-medium text-(--sea-ink) shadow-sm transition-colors duration-150 hover:border-(--pill-accent) hover:text-(--pill-accent)"
      >
        <SkillMarker skill={skill} accent={accent} hovered={hovered} />
        {skill.name}
      </motion.span>
    </motion.li>
  )
}

// ── category row ──────────────────────────────────────────────────────────────

function CategoryRow({ category }: { category: SkillCategory }) {
  const meta = CATEGORY_META[category]
  const skills = SKILLS.filter((s) => s.category === category)
  const count = skills.length

  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}% ${my}%, ${meta.glow}, transparent 62%)`

  const ref = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(((e.clientX - rect.left) / rect.width) * 100)
    my.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      style={{ ['--pill-accent' as string]: meta.accent }}
      className="group/row relative grid gap-6 py-10 md:grid-cols-[15rem_1fr] md:gap-12"
    >
      {/* cursor spotlight wash */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 inset-y-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/row:opacity-100"
        style={{ background: spotlight }}
      />

      {/* left: editorial label block */}
      <div className="md:sticky md:top-28 md:self-start">
        <span
          className="font-mono text-xs font-semibold tracking-[0.2em]"
          style={{ color: meta.accent }}
        >
          {meta.index}
        </span>
        <h3 className="display-title mt-1 text-2xl font-bold text-(--sea-ink) sm:text-[1.7rem]">
          {CATEGORY_LABELS[category]}
        </h3>
        <span
          className="mt-3 block h-0.5 w-10 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${meta.accent}, transparent)`,
          }}
        />
        <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-(--sea-ink-soft)">
          {meta.blurb}
        </p>
        <p className="mt-2 font-mono text-[11px] tracking-wide text-(--sea-ink-soft) opacity-70">
          {COUNT_WORDS[count] ?? count} disciplines
        </p>
      </div>

      {/* right: skill pills */}
      <motion.ul
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -60px 0px' }}
        className="flex flex-wrap content-start gap-2.5 md:pt-1"
      >
        {skills.map((skill) => (
          <SkillPill key={skill.id} skill={skill} accent={meta.accent} />
        ))}
      </motion.ul>
    </div>
  )
}

// ── showcase ──────────────────────────────────────────────────────────────────

export default function SkillsShowcase() {
  return (
    <SkillsLayerProvider>
      <SkillsPlayground />
      <div className="divide-y divide-(--line)" aria-label="Technical skills">
        {SKILL_CATEGORIES.map((category) => (
          <CategoryRow key={category} category={category} />
        ))}
      </div>
    </SkillsLayerProvider>
  )
}
