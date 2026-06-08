import { GraduationCap } from 'lucide-react'
import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'

const courses = [
  'Digital Systems',
  'Embedded Computing',
  'Software Engineering',
  'Signal Processing',
]

export default function EducationSection() {
  return (
    <Section id="education">
      <ScrollReveal>
        <SectionHeader
          eyebrow="Academic Background"
          title="Education"
          className="pb-8"
        />
      </ScrollReveal>

      <ScrollReveal delay={80} className="max-w-2xl">
        <div className="island-shell rounded-2xl p-6 sm:p-8">
          <div className="flex gap-5">
            <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--accent-soft) text-(--lagoon)">
              <GraduationCap className="h-6 w-6" />
            </span>
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
              <div className="flex flex-wrap gap-1.5 pt-1">
                {courses.map((tag) => (
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
  )
}
