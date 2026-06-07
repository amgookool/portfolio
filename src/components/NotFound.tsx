import { Link } from '@tanstack/react-router'

export default function NotFound() {
  return (
    <main className="page-wrap px-4 py-12 sm:py-16">
      <section className="island-shell rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.2),transparent_66%)]" />

        <p className="island-kicker mb-4">404 — Not Found</p>
        <h1 className="display-title mb-6 text-4xl font-bold tracking-tight text-(--sea-ink) sm:text-5xl leading-[1.1]">
          This page drifted out to sea.
        </h1>
        <p className="mx-auto mb-8 max-w-[48ch] text-base leading-relaxed text-(--sea-ink-soft)">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have
          moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-(--sea-ink) px-6 py-3 text-sm font-bold text-(--foam) shadow-md transition hover:-translate-y-0.5 hover:opacity-90"
        >
          Back to home
        </Link>
      </section>
    </main>
  )
}
