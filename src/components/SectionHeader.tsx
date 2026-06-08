/** Eyebrow kicker + display heading used at the top of each section. */
export default function SectionHeader({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string
  title: string
  className?: string
}) {
  return (
    <div className={`mb-10 ${className}`}>
      <p className="island-kicker mb-2">{eyebrow}</p>
      <h2 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">
        {title}
      </h2>
    </div>
  )
}
