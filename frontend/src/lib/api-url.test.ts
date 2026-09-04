import { describe, expect, it } from "vitest"
import { isBackendConfigured, resolveApiUrl } from "./api-url"

describe("isBackendConfigured", () => {
  it("is false when VITE_API_URL was not set at build time", () => {
    expect(isBackendConfigured(undefined)).toBe(false)
  })

  it("is true for any set value, including same-origin forms", () => {
    expect(isBackendConfigured("http://localhost:8000")).toBe(true)
    expect(isBackendConfigured("/")).toBe(true)
    expect(isBackendConfigured("")).toBe(true)
  })
})

describe("resolveApiUrl", () => {
  it("uses the configured URL and strips trailing slashes", () => {
    expect(resolveApiUrl("https://api.example.com/")).toBe("https://api.example.com")
    expect(resolveApiUrl(" https://api.example.com// ")).toBe("https://api.example.com")
  })

  it("maps same-origin forms to an empty base", () => {
    expect(resolveApiUrl("/")).toBe("")
    expect(resolveApiUrl("")).toBe("")
  })

  it("is empty when unset — never a localhost default", () => {
    expect(resolveApiUrl(undefined)).toBe("")
  })
})
