import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { searchOccupations, type OccupationSearchResponse } from "@/lib/api"

const DEBOUNCE_MS = 200
const STALE_MS = 5 * 60 * 1_000

/** Debounced occupation search — used by the /occupations page + onboarding. */
export function useOccupationSearch(
  rawQuery: string,
  limit = 25,
): ReturnType<typeof useQuery<OccupationSearchResponse>> & {
  debouncedQuery: string
} {
  const [debouncedQuery, setDebouncedQuery] = useState(rawQuery)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(rawQuery), DEBOUNCE_MS)
    return () => clearTimeout(id)
  }, [rawQuery])

  const query = useQuery<OccupationSearchResponse>({
    queryKey: ["occupation-search", debouncedQuery, limit],
    queryFn: () => searchOccupations(debouncedQuery, limit),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: STALE_MS,
    retry: 1,
  })

  return Object.assign(query, { debouncedQuery })
}
