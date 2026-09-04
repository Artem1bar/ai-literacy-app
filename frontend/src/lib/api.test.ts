/**
 * Tests for the API client's error mapping — the part that decides what a
 * user sees when the backend is missing, unconfigured, or unhappy.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  ApiError,
  BACKEND_OFFLINE_MESSAGE,
  LAB_UNCONFIGURED_MESSAGE,
  NETWORK_ERROR_STATUS,
  listOccupations,
  sendPrompt,
} from "./api"

const originalFetch = globalThis.fetch

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

describe("api client error mapping", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn() as unknown as typeof fetch
  })
  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it("turns a refused connection into a backend_unreachable ApiError", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValue(new TypeError("Failed to fetch"))
    const err = await sendPrompt({ prompt: "hi" }).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).code).toBe("backend_unreachable")
    expect((err as ApiError).status).toBe(NETWORK_ERROR_STATUS)
    expect((err as ApiError).message).toBe(BACKEND_OFFLINE_MESSAGE)
  })

  it("explains a 503 lab_not_configured in plain language", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      jsonResponse(
        { detail: { error: "lab_not_configured", message: "no key" } },
        503,
      ),
    )
    const err = await sendPrompt({ prompt: "hi" }).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).code).toBe("lab_not_configured")
    expect((err as ApiError).message).toBe(LAB_UNCONFIGURED_MESSAGE)
    expect((err as ApiError).message).toMatch(/ANTHROPIC_API_KEY/)
  })

  it("surfaces the backend's message for other structured errors", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      jsonResponse(
        { detail: { error: "upstream_error", message: "Claude returned an error (500)." } },
        502,
      ),
    )
    const err = await sendPrompt({ prompt: "hi" }).catch((e: unknown) => e)
    expect((err as ApiError).status).toBe(502)
    expect((err as ApiError).code).toBe("upstream_error")
    expect((err as ApiError).message).toBe(
      "Request failed (502): Claude returned an error (500).",
    )
  })

  it("keeps the rate-limit wording on 429", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      jsonResponse({ error: "Rate limit exceeded: 10 per 1 minute" }, 429),
    )
    const err = await sendPrompt({ prompt: "hi" }).catch((e: unknown) => e)
    expect((err as ApiError).code).toBe("rate_limited")
    expect((err as ApiError).message).toMatch(/rate limit/i)
  })

  it("falls back to the raw body when the error is not JSON", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response("Internal Server Error", { status: 500 }),
    )
    const err = await listOccupations().catch((e: unknown) => e)
    expect((err as ApiError).message).toBe("Request failed (500): Internal Server Error")
    expect((err as ApiError).code).toBeNull()
  })

  it("builds request URLs from the resolved API base", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ count: 0, results: [] }), { status: 200 }),
    )
    await listOccupations(true)
    const [url] = vi.mocked(globalThis.fetch).mock.calls[0]
    expect(String(url)).toMatch(/\/api\/occupations\?priorityOnly=true$/)
  })
})
