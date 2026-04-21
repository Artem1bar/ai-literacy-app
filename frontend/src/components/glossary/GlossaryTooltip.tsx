import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { GLOSSARY_TERMS } from "@/data/glossary"

interface GlossaryTooltipProps {
  slug: string
  children?: React.ReactNode
}

/**
 * Inline glossary tooltip used in ContentRenderer when a paragraph contains
 * `[[term:slug]]` markup. The anchor renders the original term text with a
 * dotted underline; the popover shows `short` + link to the full entry.
 */
export function GlossaryTooltip({ slug, children }: GlossaryTooltipProps) {
  const term = GLOSSARY_TERMS.find((t) => t.slug === slug)
  if (!term) {
    if (import.meta.env.DEV) {
      console.warn(`[GlossaryTooltip] unknown term slug "${slug}"`)
    }
    return <>{children ?? slug}</>
  }

  return (
    <HoverCard openDelay={80} closeDelay={120}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="inline border-b border-dotted border-primary/60 text-primary/90 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-sm"
          aria-label={`Definition of ${term.term}`}
        >
          {children ?? term.term}
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm">
        <p className="font-semibold">{term.term}</p>
        <p className="mt-1 text-muted-foreground">{term.short}</p>
        <a
          href={`/glossary#${term.slug}`}
          className="mt-2 inline-block text-xs underline hover:text-foreground"
        >
          Full definition →
        </a>
      </HoverCardContent>
    </HoverCard>
  )
}
