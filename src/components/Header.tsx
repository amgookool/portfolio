import { Link, useRouterState } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

const HOME_NAV = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const { location } = useRouterState()
  const isHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) backdrop-blur-lg">
      <nav className="page-wrap flex items-center gap-4 px-4 py-3 sm:py-4">
        {/* logo */}
        <Link
          to="/"
          className="shrink-0 inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) no-underline transition hover:-translate-y-px sm:px-4 sm:py-2"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
          Adrian Gookool
        </Link>

        {/* nav links — centered in the remaining space */}
        <div className="hidden flex-1 items-center justify-center gap-5 sm:flex">
          {isHome ? (
            HOME_NAV.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))
          ) : (
            <>
              <Link to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                Home
              </Link>
              <Link to="/about" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
                About
              </Link>
            </>
          )}
        </div>

        {/* right: social icons + theme toggle */}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <a
            href="https://www.linkedin.com/in/adrian-gookool-88a430198"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="rounded-lg p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://github.com/amgookool"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-lg p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" width="18" height="18" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </nav>

      {/* mobile nav — stacks below header bar */}
      <div className="flex items-center justify-center gap-4 border-t border-(--line) px-4 py-2.5 text-sm font-semibold sm:hidden">
        {isHome ? (
          HOME_NAV.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))
        ) : (
          <>
            <Link to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
              Home
            </Link>
            <Link to="/about" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
              About
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
