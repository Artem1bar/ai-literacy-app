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

/** Backend error codes the UI distinguishes (mirrors `detail.error` from FastAPI). */
export type ApiErrorCode =
  | "backend_unreachable"
  | "rate_limited"
  | "lab_not_configured"
  | (string & {})

/** `status` 0 means the request never reached a server (refused, offline, CORS). */
export const NETWORK_ERROR_STATUS = 0

export const BACKEND_OFFLINE_MESSAGE =
  "Couldn't reach the backend — run it locally or configure the API for this deployment."
export const LAB_OFFLINE_MESSAGE =
  "Prompt Lab needs the backend — run it locally or configure the API for this deployment."
export const LAB_UNCONFIGURED_MESSAGE =
  "Prompt Lab isn't configured on this deployment: the backend has no Anthropic API key. Run the backend locally with ANTHROPIC_API_KEY set, or add it to the hosting environment and redeploy."

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode | null

  constructor(message: string, status: number, code: ApiErrorCode | null = null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

interface ErrorDetail {
  code: string | null
  message: string | null
}

/** FastAPI wraps HTTPException payloads as `{ detail: string | object }`. */
function parseErrorDetail(body: string): ErrorDetail {
  try {
    const parsed = JSON.parse(body) as { detail?: unknown }
    const detail = parsed.detail
    if (typeof detail === "string") return { code: null, message: detail }
    if (detail && typeof detail === "object") {
      const d = detail as { error?: unknown; message?: unknown }
      return {
        code: typeof d.error === "string" ? d.error : null,
        message: typeof d.message === "string" ? d.message : null,
      }
    }
  } catch {
    // Not JSON — fall through to the raw body.
  }
  return { code: null, message: null }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, init)
  } catch {
    throw new ApiError(BACKEND_OFFLINE_MESSAGE, NETWORK_ERROR_STATUS, "backend_unreachable")
  }
}

async function throwForStatus(res: Response, rateLimitMessage: string): Promise<never> {
  if (res.status === 429) throw new ApiError(rateLimitMessage, 429, "rate_limited")
  const body = await res.text().catch(() => "")
  const { code, message } = parseErrorDetail(body)
  if (code === "lab_not_configured") {
    throw new ApiError(LAB_UNCONFIGURED_MESSAGE, res.status, code)
  }
  const explanation = message ?? (body || null)
  throw new ApiError(
    explanation
      ? `Request failed (${res.status}): ${explanation}`
      : `Request failed (${res.status})`,
    res.status,
    code,
  )
}

async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await request(path, init)
  if (!res.ok) {
    await throwForStatus(res, "Rate limit reached — please wait a moment and try again.")
  }
  return res.json() as Promise<T>
}

export async function sendPrompt(req: PromptRequest): Promise<PromptResponse> {
  const res = await request("/api/prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: req.prompt,
      model: req.model ?? "claude-sonnet-4-6",
      max_tokens: req.max_tokens ?? 4096,
    }),
  })

  if (!res.ok) {
    await throwForStatus(
      res,
      "Rate limit reached — you can send 10 prompts per minute. Please wait a moment.",
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Star Jobs (P5-T4)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface JobPosting {
  postingId: string
  title: string
  employer: string
  parish: string
  city: string
  socCode: string
  postedAt: string
  url: string
  summary: string
  salaryMin: number | null
  salaryMax: number | null
}

export interface JobsResponse {
  soc: string
  parishId: string | null
  stub: boolean
  count: number
  results: JobPosting[]
}

export async function fetchJobs(
  soc: string,
  parishId?: string | null,
  limit = 10,
): Promise<JobsResponse> {
  const params = new URLSearchParams({ soc, limit: String(limit) })
  if (parishId) params.set("parishId", parishId)
  return apiGet<JobsResponse>(`/api/jobs?${params.toString()}`)
}
