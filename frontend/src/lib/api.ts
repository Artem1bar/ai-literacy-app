import { API_URL } from "./constants"
import type {
  LearningPath,
  RLMAId,
  SOCOccupation,
} from "@/data/types"

export interface PromptRequest {
  prompt: string
  model?: string
  max_tokens?: number
}

export interface PromptResponse {
  content: string
  model: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init)
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    if (res.status === 429) {
      throw new ApiError(
        "Rate limit reached — please wait a moment and try again.",
        429,
      )
    }
    throw new ApiError(
      `Request failed (${res.status})${body ? `: ${body}` : ""}`,
      res.status,
    )
  }
  return res.json() as Promise<T>
}

export async function sendPrompt(req: PromptRequest): Promise<PromptResponse> {
  const res = await fetch(`${API_URL}/api/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: req.prompt,
      model: req.model ?? "claude-sonnet-4-6",
      max_tokens: req.max_tokens ?? 4096,
    }),
  })

  if (!res.ok) {
    if (res.status === 429) {
      throw new ApiError(
        "Rate limit reached — you can send 10 prompts per minute. Please wait a moment.",
        429,
      )
    }
    const body = await res.text().catch(() => "")
    throw new ApiError(
      `Request failed (${res.status})${body ? `: ${body}` : ""}`,
      res.status,
    )
  }

  return res.json() as Promise<PromptResponse>
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Occupation fetchers (P1-T7)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface OccupationListItem {
  code: string
  title: string
  jobFamily: string
  laEmployment: number | null
  laMedianWage: number | null
  sectorIds: string[]
  exposure: number
  augmentation: number
  replacement: number
  wagePremium: number
}

export interface OccupationListResponse {
  count: number
  results: OccupationListItem[]
}

export interface OccupationSearchHit {
  code: string
  title: string
  jobFamily: string
  laEmployment: number | null
  laMedianWage: number | null
  exposure: number
  exposureConfidence: "low" | "medium" | "high"
  topRLMAs: [RLMAId, number][]
}

export interface OccupationSearchResponse {
  query: string
  count: number
  results: OccupationSearchHit[]
}

export interface OccupationDetailResponse extends SOCOccupation {
  derived: {
    wagePremiumDollars: number | null
  }
}

export async function fetchOccupation(
  code: string,
): Promise<OccupationDetailResponse> {
  return apiGet<OccupationDetailResponse>(
    `/api/occupation/${encodeURIComponent(code)}`,
  )
}

export async function fetchCurriculum(code: string): Promise<LearningPath> {
  return apiGet<LearningPath>(
    `/api/curriculum/${encodeURIComponent(code)}`,
  )
}

export async function searchOccupations(
  query: string,
  limit = 25,
): Promise<OccupationSearchResponse> {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  return apiGet<OccupationSearchResponse>(
    `/api/occupations/search?${params.toString()}`,
  )
}

export async function listOccupations(
  priorityOnly = false,
): Promise<OccupationListResponse> {
  const params = new URLSearchParams()
  if (priorityOnly) params.set("priorityOnly", "true")
  return apiGet<OccupationListResponse>(
    `/api/occupations${params.toString() ? `?${params.toString()}` : ""}`,
  )
}
