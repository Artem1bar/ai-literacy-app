/**
 * Tests for usePromptLab — the core Lab hook (P0-T3).
 *
 * Covers:
 *   - scorePrompt heuristics (length, role, format, constraints, XML)
 *   - round-trip submit happy path with a stubbed fetch
 *   - error state surfacing
 *   - clear() resets everything
 */

import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { usePromptLab } from "./usePromptLab"

const originalFetch = globalThis.fetch

function stubFetch(body: object, status = 200) {
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  )
}

describe("usePromptLab", () => {
  beforeEach(() => {
    globalThis.fetch = stubFetch({
      content: "# Hello\n\nThis is a stubbed response.",
      model: "claude-sonnet-4-6",
      usage: { input_tokens: 10, output_tokens: 42 },
    }) as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it("starts with empty state", () => {
    const { result } = renderHook(() => usePromptLab())
    expect(result.current.prompt).toBe("")
    expect(result.current.response).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.score).toBeNull()
  })

  it("scores prompts with role + format + constraints + XML", () => {
    const { result } = renderHook(() => usePromptLab())
    act(() => {
      result.current.setPrompt(
        "<context>You are a helpful assistant. Format the output as a numbered list, no more than 5 items.</context>",
      )
    })
    expect(result.current.score).not.toBeNull()
    expect(result.current.score!.total).toBeGreaterThanOrEqual(70)
    const labels = result.current.score!.breakdown.map((b) => b.label)
    expect(labels).toContain("Role instruction")
    expect(labels).toContain("Output format")
    expect(labels).toContain("Structure (XML tags)")
  })

  it("penalises too-short prompts with a low length score", () => {
    const { result } = renderHook(() => usePromptLab())
    act(() => {
      result.current.setPrompt("hi")
    })
    const lenEntry = result.current.score!.breakdown.find(
      (b) => b.label === "Detail & length",
    )
    expect(lenEntry?.score).toBeLessThanOrEqual(2)
  })

  it("submit() sends prompt and captures response", async () => {
    const { result } = renderHook(() => usePromptLab())

    act(() => {
      result.current.setPrompt("Explain tokens")
    })

    await act(async () => {
      await result.current.submit()
    })

    await waitFor(() => {
      expect(result.current.response).not.toBeNull()
    })
    expect(result.current.response?.model).toBe("claude-sonnet-4-6")
    expect(result.current.response?.content).toContain("stubbed response")
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it("submit() does nothing on empty prompt", async () => {
    const { result } = renderHook(() => usePromptLab())
    await act(async () => {
      await result.current.submit()
    })
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it("surfaces a rate-limit error from the backend", async () => {
    globalThis.fetch = stubFetch(
      { error: "Too many requests" },
      429,
    ) as unknown as typeof fetch
    const { result } = renderHook(() => usePromptLab())

    act(() => {
      result.current.setPrompt("hello world")
    })
    await act(async () => {
      await result.current.submit()
    })

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })
    expect(result.current.error).toMatch(/rate limit/i)
    expect(result.current.response).toBeNull()
  })

  it("clear() resets state", async () => {
    const { result } = renderHook(() => usePromptLab())
    act(() => {
      result.current.setPrompt("some prompt")
    })
    await act(async () => {
      await result.current.submit()
    })
    act(() => {
      result.current.clear()
    })
    expect(result.current.prompt).toBe("")
    expect(result.current.response).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.score).toBeNull()
  })
})
