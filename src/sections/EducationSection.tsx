import { useRef } from 'react'
import { GraduationCap } from 'lucide-react'
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

const courses = [
  'Digital Systems',
  'Embedded Computing',
  'Software Engineering',
  'Signal Processing',
]

const cardVariants = {
  idle: { y: 0 },
  hover: {
    y: -4,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
}

const iconVariants = {
  idle: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.18,
    rotate: -12,
    transition: { type: 'spring' as const, stiffness: 350, damping: 14 },
  },
}

const tagVariants = {
  idle: { y: 0, scale: 1 },
  hover: (i: number) => ({
    y: -3,
    scale: 1.08,
    transition: {
      delay: i * 0.07,
      type: 'spring' as const,
      stiffness: 450,
      damping: 22,
    },
  }),
}

export default function EducationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)

  const spotX = useTransform(mx, [0, 1], ['0%', '100%'])
  const spotY = useTransform(my, [0, 1], ['0%', '100%'])
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX} ${spotY}, rgba(79,184,178,0.09), transparent 65%)`

  // icon badge drifts faster than the card — parallax depth illusion
  const rawIconX = useTransform(mx, [0, 1], [-12, 12])
  const rawIconY = useTransform(my, [0, 1], [-10, 10])
  const iconX = useSpring(rawIconX, { stiffness: 180, damping: 22 })
  const iconY = useSpring(rawIconY, { stiffness: 180, damping: 22 })

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
    <Section id="education">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Academic Background"
          title="Education"
          className="pb-8"
        />
      </ScrollReveal>

      <ScrollReveal delay={80} className="max-w-2xl group">
        <motion.div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          variants={cardVariants}
          initial="idle"
          whileHover="hover"
          className="group island-shell relative overflow-hidden rounded-2xl p-6 sm:p-8 hover:border-(--lagoon) hover:shadow-xl transition-[border-color,box-shadow] duration-200 cursor-default"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ background: spotlight }}
          />

          <div className="flex gap-5">
            {/* badge drifts independently — deeper parallax layer */}
            <motion.span
              style={{ x: iconX, y: iconY }}
              className="relative mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--accent-soft) text-(--lagoon) group-hover:bg-(--accent-mid) group-hover:shadow-[0_4px_20px_rgba(79,184,178,0.28)] transition-[background-color,box-shadow] duration-200"
            >
              <motion.span variants={iconVariants}>
                <GraduationCap className="h-6 w-6" />
              </motion.span>
            </motion.span>

            <div className="space-y-1.5">
              <span className="font-mono text-xs text-(--sea-ink-soft)">
                September 2019 – June 2023
              </span>
              <h3 className="text-lg font-bold leading-snug text-(--sea-ink)">
                BSc Electrical &amp; Computer Engineering (Honours)
              </h3>
              <p className="text-sm font-semibold text-(--lagoon-deep)">
                The University of the West Indies, St. Augustine &middot;
                Trinidad and Tobago
              </p>
              <p className="mt-3 text-sm leading-relaxed text-(--sea-ink-soft)">
                Four-year honours programme covering digital systems design,
                embedded computing, software engineering principles, signal
                processing, and advanced mathematics — providing a rigorous
                foundation for systems-level and full-stack software
                development.
              </p>
              <div className="flex flex-wrap gap-x-1.5 gap-y-2 pt-2 group-hover:gap-x-3.5 transition-[gap] duration-150">
                {courses.map((tag, i) => (
                  <motion.span
                    key={tag}
                    custom={i}
                    variants={tagVariants}
                    className="cursor-default rounded-full border border-(--line) bg-(--fg-soft) px-2.5 py-0.5 text-xs font-medium text-(--sea-ink-soft) group-hover:border-(--lagoon) group-hover:text-(--lagoon) transition-colors duration-150"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </ScrollReveal>
    </Section>
  )
}
