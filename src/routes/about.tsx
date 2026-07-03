import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-12 sm:py-16">
      <section className="island-shell rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.2),transparent_66%)]" />

        <p className="island-kicker mb-4">About Me</p>
        <h1 className="display-title mb-6 text-4xl font-bold tracking-tight text-(--sea-ink) sm:text-5xl leading-[1.1]">
          Believer in good architecture, design, and scalability.
        </h1>

        <div className="grid gap-8 md:grid-cols-3 pt-1.5">
          <div className="md:col-span-2 space-y-6 text-base leading-relaxed text-(--sea-ink-soft)">
            <p>
              I am a passionate software engineer dedicated to building
              scalable, efficient, and reliable software solutions that solve
              real-world problems. With experience across the full stack—ranging
              from backend services in Node.js and Spring Boot to modern
              frontend frameworks like React, Svelte, and Angular—I enjoy taking
              ideas from concept to production.
            </p>
            <p>
              My professional philosophy is rooted in code quality,
              maintainability, and elegant architecture. I believe that writing
              code is only a part of software engineering; designing systems
              that can grow, adapt, and handle loads gracefully is where the
              true value lies.
            </p>
            <p>
              As a lifelong learner, I am constantly exploring the ever-evolving
              landscapes of technology, including AI agentic workflows and
              modern containerization. I thrive in collaborative,
              cross-functional team environments where we can learn from each
              other and build premium user experiences.
            </p>
          </div>

          <div className="space-y-6 gap-2.5 flex flex-col">
            <div className="rounded-2xl border border-(--line) bg-white/20 p-6 backdrop-blur-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-(--kicker) mb-4">
                Contact Info
              </h3>
              <ul className="space-y-3 text-sm text-(--sea-ink-soft)">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-(--sea-ink) min-w-17.5">
                    Email:
                  </span>
                  <a
                    href="mailto:amgookool@gmail.com"
                    className="break-all hover:text-(--lagoon-deep) transition"
                  >
                    amgookool@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-(--sea-ink) min-w-17.5">
                    Phone:
                  </span>
                  <a
                    href="tel:+18684755372"
                    className="hover:text-(--lagoon-deep) transition"
                  >
                    +1 (868) 475-5372
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-(--sea-ink) min-w-17.5">
                    Location:
                  </span>
                  <span>St. Augustine, Trinidad and Tobago</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-(--line) bg-white/20 p-6 backdrop-blur-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-(--kicker) mb-3">
                Core Values
              </h3>
              <ul className="list-disc pl-5 text-sm text-(--sea-ink-soft) space-y-2">
                <li>Robust & clean architecture</li>
                <li>Intuitive UX/UI design</li>
                <li>Continuous self-improvement</li>
                <li>High-efficiency workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
