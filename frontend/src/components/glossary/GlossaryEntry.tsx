import { useEffect, useRef } from "react"
import { useLocation } from "react-router"
import ReactMarkdown from "react-markdown"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { GlossaryTerm } from "@/data/types"
import { cn } from "@/lib/utils"

interface GlossaryEntryProps {
  term: GlossaryTerm
}

export function GlossaryEntry({ term }: GlossaryEntryProps) {
  const ref = useRef<HTMLElement>(null)
  const { hash } = useLocation()
  const isTarget = hash === `#${term.slug}`

  useEffect(() => {
    if (isTarget && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [isTarget])

  return (
    <article
      id={term.slug}
      ref={ref}
      className={cn(
        "scroll-mt-24 rounded-lg border border-border px-5 py-4 transition-colors",
        isTarget && "border-primary bg-primary/5",
      )}
    >
      <header className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold">
          <a href={`#${term.slug}`} className="hover:text-primary">
            {term.term}
          </a>
        </h2>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
          {term.category}
        </Badge>
      </header>
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown>{term.long}</ReactMarkdown>
      </div>

      {(term.relatedSlugs.length > 0 || term.seeAlso.length > 0) && (
        <footer className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {term.relatedSlugs.map((slug) => (
            <a
              key={slug}
              href={`#${slug}`}
              className="rounded-md border border-border px-2 py-0.5 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              {slug}
            </a>
          ))}
          {term.seeAlso.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              {link.label} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </footer>
      )}
    </article>
  )
}
