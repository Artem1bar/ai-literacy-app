import { useQuery } from "@tanstack/react-query"
import {
  fetchCurriculum,
  fetchOccupation,
  listOccupations,
  type OccupationDetailResponse,
  type OccupationListResponse,
} from "@/lib/api"
import type { LearningPath } from "@/data/types"

const STALE_ONE_HOUR = 60 * 60 * 1_000

/** Fetch a single SOC occupation with full score card and skill bundle. */
export function useOccupation(code: string | null) {
  return useQuery<OccupationDetailResponse>({
    queryKey: ["occupation", code],
    queryFn: () => fetchOccupation(code!),
    enabled: !!code,
    staleTime: STALE_ONE_HOUR,
    retry: 1,
  })
}

/** Fetch the learning path for a SOC. */
export function useCurriculum(code: string | null) {
  return useQuery<LearningPath>({
    queryKey: ["curriculum", code],
    queryFn: () => fetchCurriculum(code!),
    enabled: !!code,
    staleTime: STALE_ONE_HOUR,
    retry: 1,
  })
}

/** Fetch the full occupations list (optionally filtered to priority SOCs). */
export function useOccupations(priorityOnly = false) {
  return useQuery<OccupationListResponse>({
    queryKey: ["occupations", { priorityOnly }],
    queryFn: () => listOccupations(priorityOnly),
    staleTime: STALE_ONE_HOUR,
    retry: 1,
  })
}
