import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Rows3, Sparkles } from 'lucide-react'
import { SKILLS, SKILL_CATEGORIES, CATEGORY_LABELS } from '#/data/skills'
import type { Skill, SkillCategory } from '#/data/skills'
import SkillsLayerProvider, {
  SkillsLayerContext,
  useSkillsLayer,
} from './SkillsCanvas'
import SkillMarker from './SkillMarker'
import SkillsPlayground, { usePlaygroundSupported } from './SkillsPlayground'

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

// ── view toggle ───────────────────────────────────────────────────────────────

type SkillsView = 'playground' | 'list'

const VIEW_OPTIONS = [
  { id: 'playground', label: 'Playground', Icon: Sparkles },
  { id: 'list', label: 'List', Icon: Rows3 },
] as const

function ViewToggle({
  view,
  onChange,
}: {
  view: SkillsView
  onChange: (view: SkillsView) => void
}) {
  return (
    <div
      role="group"
      aria-label="Skills view"
      className="inline-flex items-center gap-1 rounded-full border border-(--line) bg-(--surface) p-1"
    >
      {VIEW_OPTIONS.map(({ id, label, Icon }) => {
        const active = view === id
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className="relative inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide transition-colors duration-150"
            style={{
              color: active ? 'var(--lagoon)' : 'var(--sea-ink-soft)',
            }}
          >
            {active && (
              <motion.span
                layoutId="skills-view-pill"
                aria-hidden
                className="absolute inset-0 rounded-full border border-(--lagoon)"
                style={{
                  background:
                    'color-mix(in oklch, var(--lagoon) 12%, transparent)',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              />
            )}
            <Icon className="relative size-3.5" aria-hidden />
            <span className="relative">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── marker layer gate ─────────────────────────────────────────────────────────

// The pill markers draw into a shared fixed-position canvas that sits outside
// the view wrappers, so hiding the list's DOM doesn't hide its 3D logos. This
// gate flips the layer context off while the list view is hidden, dropping
// every marker back to its dot (and unmounting its <View> from the shared
// canvas). GLBs stay cached, so re-showing the list is instant.
function MarkerLayerGate({
  enabled,
  children,
}: {
  enabled: boolean
  children: ReactNode
}) {
  const parent = useSkillsLayer()
  const value = useMemo(
    () => ({ active: parent.active && enabled }),
    [parent.active, enabled],
  )
  return (
    <SkillsLayerContext.Provider value={value}>
      {children}
    </SkillsLayerContext.Provider>
  )
}

// ── showcase ──────────────────────────────────────────────────────────────────

// Both views stay mounted so the playground's WebGL canvas (and its uploaded
// GLB assets) survives toggling; the inactive view is faded out, made inert,
// and pulled out of the layout as an absolutely-positioned overlay.
const viewVariants: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    display: 'block',
    transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
  },
  hidden: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
    transitionEnd: { display: 'none' },
  },
}

const HIDDEN_VIEW_CLASS = 'pointer-events-none absolute inset-0 overflow-hidden'

export default function SkillsShowcase() {
  const playgroundSupported = usePlaygroundSupported()
  const [view, setView] = useState<SkillsView>('playground')
  const activeView: SkillsView = playgroundSupported ? view : 'list'
  const playgroundActive = activeView === 'playground'

  return (
    <SkillsLayerProvider>
      {playgroundSupported && (
        <div className="mb-5 flex justify-end">
          <ViewToggle view={activeView} onChange={setView} />
        </div>
      )}
      <div className="relative">
        {playgroundSupported && (
          <motion.div
            variants={viewVariants}
            initial={false}
            animate={playgroundActive ? 'visible' : 'hidden'}
            inert={!playgroundActive}
            className={playgroundActive ? undefined : HIDDEN_VIEW_CLASS}
          >
            <SkillsPlayground paused={!playgroundActive} />
          </motion.div>
        )}
        <motion.div
          variants={viewVariants}
          initial={false}
          animate={playgroundActive ? 'hidden' : 'visible'}
          inert={playgroundActive}
          className={playgroundActive ? HIDDEN_VIEW_CLASS : undefined}
          aria-label="Technical skills"
        >
          <MarkerLayerGate enabled={!playgroundActive}>
            <div className="divide-y divide-(--line)">
              {SKILL_CATEGORIES.map((category) => (
                <CategoryRow key={category} category={category} />
              ))}
            </div>
          </MarkerLayerGate>
        </motion.div>
      </div>
    </SkillsLayerProvider>
  )
}
