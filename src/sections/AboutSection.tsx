import { Mail, Phone, MapPin, Briefcase } from 'lucide-react'
import Section from '#/components/Section'
import SectionHeader from '#/components/SectionHeader'
import ScrollReveal from '#/components/ScrollReveal'

const quickFacts: {
  label: string
  value: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { label: 'Location', value: 'St. Augustine, T&T', icon: MapPin },
  {
    label: 'Email',
    value: 'amgookool@gmail.com',
    href: 'mailto:amgookool@gmail.com',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '+1 (868) 475-5372',
    href: 'tel:+18684755372',
    icon: Phone,
  },
  { label: 'Work mode', value: 'Remote & On-site', icon: Briefcase },
]

export default function AboutSection() {
  return (
    <Section id="about">
      <div className="grid gap-12 md:grid-cols-3 md:gap-16">
        <ScrollReveal className="md:col-span-2 space-y-6">
          <SectionHeader
            eyebrow="Biography"
            title="Passionate about clean architecture & systems design."
            className="pb-2.5"
          />
          <p className="text-base leading-relaxed text-(--sea-ink-soft)">
            I am a passionate software engineer dedicated to building scalable,
            efficient, and reliable software solutions. With experience across
            the full stack — from backend services in Node.js and Spring Boot to
            modern frontend frameworks like React, Svelte, and Angular — I enjoy
            taking ideas from concept to production.
          </p>
          <p className="text-base leading-relaxed text-(--sea-ink-soft)">
            My professional philosophy is rooted in code quality,
            maintainability, and elegant architecture. I believe that writing
            code is only a part of software engineering; designing systems that
            can grow, adapt, and handle loads gracefully is where the true value
            lies.
          </p>
          <p className="text-base leading-relaxed text-(--sea-ink-soft)">
            As a lifelong learner, I am constantly exploring the ever-evolving
            landscapes of technology, including AI agentic workflows and modern
            containerization. I thrive in collaborative, cross-functional team
            environments where we build premium user experiences together.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120} className="rise-in pt-2">
          <div className="island-shell rounded-2xl p-6">
            <p className="island-kicker mb-4">Quick Facts</p>
            {quickFacts.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 border-b border-(--line) py-3 last:border-0"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--accent-soft) text-(--lagoon)">
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-(--sea-ink-soft)">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-(--sea-ink) transition hover:text-(--lagoon-deep)"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-(--sea-ink)">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </Section>
  )
}
