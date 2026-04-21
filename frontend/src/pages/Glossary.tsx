import { useMemo, useState } from "react"
import { BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GlossaryEntry } from "@/components/glossary/GlossaryEntry"
import { GlossaryIndex } from "@/components/glossary/GlossaryIndex"
import { GLOSSARY_TERMS } from "@/data/glossary"
import type { GlossaryCategory } from "@/data/types"
import { cn } from "@/lib/utils"

const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  "ai-concepts": "AI Concepts",
  "tools": "Tools",
  "frameworks": "Frameworks",
  "la-workforce": "Louisiana Workforce",
  "methodology": "Methodology",
}

export default function Glossary() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<GlossaryCategory | "all">("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return GLOSSARY_TERMS.filter((t) => {
      if (category !== "all" && t.category !== category) return false
      if (!q) return true
      return (
        t.term.toLowerCase().includes(q) ||
        t.slug.includes(q) ||
        t.short.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.term.localeCompare(b.term)),
    [filtered],
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold">Glossary</h1>
      </div>
      <p className="mb-6 max-w-2xl text-muted-foreground">
        {GLOSSARY_TERMS.length} terms covering AI concepts, tools, frameworks, Louisiana
        workforce taxonomy, and the methodology behind every score on this site.
      </p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          aria-label="Search glossary terms"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <CategoryChip
          label="All"
          active={category === "all"}
          onClick={() => setCategory("all")}
          count={GLOSSARY_TERMS.length}
        />
        {(
          [
            "ai-concepts",
            "tools",
            "frameworks",
            "la-workforce",
            "methodology",
          ] as GlossaryCategory[]
        ).map((c) => (
          <CategoryChip
            key={c}
            label={CATEGORY_LABELS[c]}
            active={category === c}
            onClick={() => setCategory(c)}
            count={GLOSSARY_TERMS.filter((t) => t.category === c).length}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
        <div className="hidden md:block">
          <GlossaryIndex entries={sorted} />
        </div>
        <div className="space-y-6">
          {sorted.length === 0 && (
            <p className="text-sm text-muted-foreground">No terms match.</p>
          )}
          {sorted.map((t) => (
            <GlossaryEntry key={t.slug} term={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
  count,
}: {
  label: string
  active: boolean
  onClick: () => void
  count: number
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary/10 font-medium"
          : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label} <span className="ml-1 opacity-60">{count}</span>
    </button>
  )
}
