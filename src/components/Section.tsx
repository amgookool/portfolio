import type { ReactNode } from 'react'

/** Standard page section: vertical rhythm, bottom divider, and content wrap. */
export default function Section({
  id,
  children,
}: {
  id?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-(--line) py-16 sm:py-24"
    >
      <div className="page-wrap px-4">{children}</div>
    </section>
  )
}
