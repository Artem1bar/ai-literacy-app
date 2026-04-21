import { describe, expect, it } from "vitest"
import { GLOSSARY_TERMS } from "./glossary"

describe("GLOSSARY_TERMS", () => {
  it("has at least 40 terms (plan P1-T2)", () => {
    expect(GLOSSARY_TERMS.length).toBeGreaterThanOrEqual(40)
  })

  it("every slug is unique, kebab-case, and URL-safe", () => {
    const slugs = new Set<string>()
    for (const term of GLOSSARY_TERMS) {
      expect(term.slug, `slug on term "${term.term}"`).toMatch(
        /^[a-z][a-z0-9-]*[a-z0-9]$/,
      )
      expect(slugs.has(term.slug)).toBe(false)
      slugs.add(term.slug)
    }
  })

  it("every relatedSlugs reference resolves", () => {
    const slugs = new Set(GLOSSARY_TERMS.map((t) => t.slug))
    for (const term of GLOSSARY_TERMS) {
      for (const ref of term.relatedSlugs) {
        expect(slugs.has(ref), `${term.slug} → unknown ref "${ref}"`).toBe(true)
      }
    }
  })

  it("every term has short ≤120 chars and long ≥40 chars", () => {
    for (const term of GLOSSARY_TERMS) {
      expect(term.short.length, `${term.slug} short`).toBeLessThanOrEqual(120)
      expect(term.long.length, `${term.slug} long`).toBeGreaterThanOrEqual(40)
    }
  })

  it("covers all five categories", () => {
    const categories = new Set(GLOSSARY_TERMS.map((t) => t.category))
    expect(categories).toEqual(
      new Set(["ai-concepts", "la-workforce", "methodology", "tools", "frameworks"]),
    )
  })

  it("defines the four score-card metrics explicitly", () => {
    const slugs = new Set(GLOSSARY_TERMS.map((t) => t.slug))
    for (const needed of [
      "ai-exposure",
      "augmentation",
      "replacement",
      "wage-premium",
      "confidence-level",
    ]) {
      expect(slugs.has(needed), `missing methodology term "${needed}"`).toBe(true)
    }
  })
})
