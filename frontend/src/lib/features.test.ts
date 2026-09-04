import { describe, expect, it } from "vitest"
import { ROUTES } from "./constants"
import { availableRoles, navLinks, requiresBackend } from "./features"

describe("requiresBackend", () => {
  it("flags the Lab, occupation, and occupation-feeder routes", () => {
    for (const path of [
      ROUTES.LAB,
      ROUTES.OCCUPATIONS,
      ROUTES.OCCUPATION_DETAIL,
      ROUTES.COMPARE,
      ROUTES.ASSESSMENT,
      ROUTES.MEGAPROJECTS,
      ROUTES.ONBOARDING,
      "/onboarding/:step",
    ]) {
      expect(requiresBackend(path), path).toBe(true)
    }
  })

  it("leaves the static course alone", () => {
    for (const path of [
      ROUTES.HOME,
      ROUTES.LEARN,
      ROUTES.MODULE,
      ROUTES.RESOURCES,
      ROUTES.PROFILE,
      ROUTES.GLOSSARY,
      "*",
    ]) {
      expect(requiresBackend(path), path).toBe(false)
    }
  })
})

describe("navLinks", () => {
  it("offers every surface when a backend is configured", () => {
    expect(navLinks(true).map((l) => l.label)).toEqual([
      "Learn",
      "Occupations",
      "Megaprojects",
      "Prompt Lab",
      "Glossary",
      "Resources",
      "Profile",
    ])
  })

  it("drops the backend-only entries for a static build", () => {
    const labels = navLinks(false).map((l) => l.label)
    expect(labels).toEqual(["Learn", "Glossary", "Resources", "Profile"])
    expect(navLinks(false).map((l) => l.href)).not.toContain(ROUTES.LAB)
  })
})

describe("availableRoles", () => {
  it("includes the Louisiana Worker role only with a backend", () => {
    expect(availableRoles(true).map((r) => r.id)).toContain("worker")
    expect(availableRoles(false).map((r) => r.id)).toEqual(["student", "professor", "developer"])
  })
})
