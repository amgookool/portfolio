import { ChevronDown } from 'lucide-react'
import HeroCanvas from '#/components/HeroCanvas'
import ScrollReveal from '#/components/ScrollReveal'

const stats: {
  value: string
  label: string
}[] = [
  { value: '3+', label: 'Years of experience' },
  { value: '3', label: 'Companies worked at' },
  { value: '10+', label: 'Technologies mastered' },
  { value: 'BSc', label: 'Electrical & Computer Eng.' },
]

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <HeroCanvas />

      {/* fade-out at bottom so stats bar reads clearly */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-52"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--bg-base))',
        }}
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
            <span className="text-(--lagoon-deep)">
              architecting solid products.
            </span>
          </h1>

          {/* lead text */}
          <p className="max-w-[54ch] text-lg leading-relaxed text-(--sea-ink-soft) pt-4">
            Hi, I&rsquo;m Adrian — a Software Engineer specializing in backend
            architecture, frontend UX, and systems engineering. Currently
            crafting health-tech software at{' '}
            <span className="font-semibold text-(--sea-ink)">
              Dolphin Health
            </span>
            .
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
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
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
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
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
              <div
                key={s.label}
                className="cursor-default bg-(--surface) px-6 py-5 transition hover:bg-(--surface2)"
              >
                <p className="display-title text-4xl font-extrabold tracking-tight text-(--sea-ink)">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-medium text-(--sea-ink-soft)">
                  {s.label}
                </p>
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
  )
}
