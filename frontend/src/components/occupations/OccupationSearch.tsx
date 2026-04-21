import { useCallback, useEffect, useRef, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useOccupationSearch } from "@/hooks/useOccupationSearch"
import type { OccupationSearchHit } from "@/lib/api"
import { cn } from "@/lib/utils"

interface OccupationSearchProps {
  initialQuery?: string
  onSelect?: (hit: OccupationSearchHit) => void
  /** Render a given hit as a custom card. Falls back to a minimal row. */
  renderHit?: (hit: OccupationSearchHit, selected: boolean) => React.ReactNode
  /** Auto-focus the input on mount (default true). */
  autoFocus?: boolean
  className?: string
}

export function OccupationSearch({
  initialQuery = "",
  onSelect,
  renderHit,
  autoFocus = true,
  className,
}: OccupationSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [activeIdx, setActiveIdx] = useState(0)
  const search = useOccupationSearch(query, 25)
  const listboxRef = useRef<HTMLUListElement>(null)

  const results = search.data?.results ?? []

  const selectHit = useCallback(
    (hit: OccupationSearchHit | undefined) => {
      if (!hit) return
      onSelect?.(hit)
    },
    [onSelect],
  )

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      selectHit(results[activeIdx])
    }
  }

  useEffect(() => {
    setActiveIdx(0)
  }, [search.debouncedQuery])

  useEffect(() => {
    const el = listboxRef.current?.querySelector<HTMLLIElement>(
      `li[data-idx="${activeIdx}"]`,
    )
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIdx])

  const showEmpty =
    search.debouncedQuery.trim().length > 0 &&
    !search.isLoading &&
    !search.isFetching &&
    results.length === 0

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search by job title or SOC code — e.g. welder, 29-1141"
          aria-label="Search Louisiana occupations"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="occupation-results"
          aria-activedescendant={
            results[activeIdx] ? `occ-opt-${results[activeIdx].code}` : undefined
          }
          className="pl-9"
        />
        {(search.isLoading || search.isFetching) && query && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {search.isError && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          Couldn't reach the search service. Check that the backend is running.
        </p>
      )}

      {showEmpty && (
        <p className="mt-3 text-sm text-muted-foreground">
          No occupations found for <span className="font-medium">"{query}"</span>. Try a
          broader job family — e.g. nurse, operator, engineer, driver.
        </p>
      )}

      {results.length > 0 && (
        <ul
          ref={listboxRef}
          id="occupation-results"
          role="listbox"
          aria-label="Occupation results"
          className="mt-3 space-y-2"
        >
          {results.map((hit, i) => {
            const selected = i === activeIdx
            return (
              <li
                key={hit.code}
                id={`occ-opt-${hit.code}`}
                data-idx={i}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => selectHit(hit)}
                className="cursor-pointer"
              >
                {renderHit ? renderHit(hit, selected) : (
                  <div
                    className={cn(
                      "rounded-md border px-4 py-3 transition-colors",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium">{hit.title}</span>
                      <span className="text-xs text-muted-foreground">{hit.code}</span>
                    </div>
                    {hit.jobFamily && (
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {hit.jobFamily}
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
