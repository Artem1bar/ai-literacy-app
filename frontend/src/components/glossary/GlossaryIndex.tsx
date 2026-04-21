import type { GlossaryTerm } from "@/data/types"

interface GlossaryIndexProps {
  entries: readonly GlossaryTerm[]
}

export function GlossaryIndex({ entries }: GlossaryIndexProps) {
  return (
    <nav className="sticky top-20" aria-label="Glossary index">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        A–Z
      </p>
      <ul className="space-y-1 text-sm">
        {entries.map((t) => (
          <li key={t.slug}>
            <a
              href={`#${t.slug}`}
              className="block truncate text-muted-foreground hover:text-foreground"
            >
              {t.term}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
