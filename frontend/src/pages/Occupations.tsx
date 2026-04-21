import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Briefcase, ArrowRight } from "lucide-react"
import { OccupationSearch } from "@/components/occupations/OccupationSearch"
import { OccupationResultCard } from "@/components/occupations/OccupationResultCard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SECTORS } from "@/data/louisiana"
import { useOccupations } from "@/hooks/useOccupation"
import type { OccupationSearchHit } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function Occupations() {
  const navigate = useNavigate()
  const [query] = useState("")
  const browse = useOccupations(false)

  const handleSelect = (hit: OccupationSearchHit) => {
    navigate(`/occupations/${encodeURIComponent(hit.code)}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold">Louisiana Occupations</h1>
      </div>
      <p className="mb-8 max-w-2xl text-muted-foreground">
        Browse or search 26 Louisiana occupations with AI exposure scores, augmentation
        and automation splits, and recommended learning paths.
      </p>

      <div className="mb-10">
        <OccupationSearch
          initialQuery={query}
          onSelect={handleSelect}
          renderHit={(hit, selected) => (
            <OccupationResultCard hit={hit} selected={selected} />
          )}
          autoFocus={false}
        />
      </div>

      {/* Browse all — grouped by job family */}
      {!query && browse.data && (
        <>
          <h2 className="mb-4 text-xl font-semibold">Browse all</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {SECTORS.map((sector) => {
              const items = browse.data!.results.filter((r) =>
                r.sectorIds.includes(sector.id),
              )
              if (items.length === 0) return null
              return (
                <Card key={sector.id}>
                  <CardContent className="p-5">
                    <h3 className="mb-1 font-semibold">{sector.label}</h3>
                    <p className="mb-4 text-xs text-muted-foreground">
                      {sector.description}
                    </p>
                    <ul className="space-y-2">
                      {items.map((occ) => (
                        <li key={occ.code}>
                          <Link
                            to={`/occupations/${encodeURIComponent(occ.code)}`}
                            className="group flex items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-sm transition-colors hover:border-border hover:bg-accent/30"
                          >
                            <div className="flex items-baseline gap-2">
                              <span className="group-hover:text-primary">
                                {occ.title}
                              </span>
                              <span className="font-mono text-xs text-muted-foreground">
                                {occ.code}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "text-xs",
                                occ.exposure >= 60 ? "text-amber-500" : "text-muted-foreground",
                              )}
                            >
                              {Math.round(occ.exposure)}%
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {browse.isError && (
        <Card className="mt-8 border-destructive/40 bg-destructive/5">
          <CardContent className="p-5 text-sm">
            Couldn't reach the occupation service. Make sure the backend is running at{" "}
            <code className="font-mono">http://localhost:8000</code>.
          </CardContent>
        </Card>
      )}

      <div className="mt-12 rounded-lg border border-dashed border-border p-6 text-center">
        <p className="mb-3 text-sm text-muted-foreground">
          Not sure which SOC describes your role?
        </p>
        <Button variant="outline" asChild>
          <Link to="/assessment" className="gap-1.5">
            Take the quick assessment <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
