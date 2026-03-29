import { useState } from "react"
import { ExternalLink, BookMarked } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { RESOURCES } from "@/data/resources"
import type { ResourceCategory } from "@/data/types"

const CATEGORY_LABELS: Record<ResourceCategory | "all", string> = {
  all: "All",
  "official-docs": "Official Docs",
  "ai-literacy-frameworks": "AI Literacy",
  "prompt-engineering": "Prompt Engineering",
  "github-repos": "GitHub Repos",
  "research-papers": "Research",
  "tools-plugins": "Tools",
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as (ResourceCategory | "all")[]

export default function Resources() {
  const [category, setCategory] = useState<ResourceCategory | "all">("all")
  const [search, setSearch] = useState("")

  const filtered = RESOURCES.filter((r) => {
    const matchCat = category === "all" || r.category === category
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some((t) => t.includes(q))
    return matchCat && matchSearch
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-2">
        <BookMarked className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold">Resources</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Curated links to official documentation, AI literacy frameworks, prompt engineering guides,
        and GitHub repositories.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Tabs value={category} onValueChange={(v) => setCategory(v as ResourceCategory | "all")}>
          <TabsList className="flex-wrap h-auto gap-1">
            {CATEGORIES.filter((c) => RESOURCES.some((r) => c === "all" || r.category === c)).map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs">
                {CATEGORY_LABELS[c]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/40 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {resource.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {CATEGORY_LABELS[resource.category]}
                  </Badge>
                  {resource.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No resources match your search.
        </p>
      )}
    </div>
  )
}
