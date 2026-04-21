import { describe, expect, it } from "vitest"
import {
  EMPLOYERS,
  PARISHES,
  RLMAS,
  SECTORS,
  employersInParish,
  employersInRLMA,
  parishById,
  rlmaForParish,
} from "./louisiana"

describe("Louisiana geography", () => {
  it("includes all 64 Louisiana parishes", () => {
    expect(PARISHES).toHaveLength(64)
  })

  it("assigns every parish to exactly one RLMA", () => {
    for (const parish of PARISHES) {
      expect(parish.rlma).toMatch(/^RLMA-[1-8]$/)
      const rlma = RLMAS.find((r) => r.id === parish.rlma)
      expect(rlma, `RLMA ${parish.rlma} for ${parish.id}`).toBeDefined()
      expect(rlma!.parishIds).toContain(parish.id)
    }
  })

  it("has parish ids unique", () => {
    const ids = new Set(PARISHES.map((p) => p.id))
    expect(ids.size).toBe(PARISHES.length)
  })

  it("has exactly 8 RLMAs covering the full state", () => {
    expect(RLMAS).toHaveLength(8)
    const parishesInRlmas = new Set(
      RLMAS.flatMap((r) => r.parishIds),
    )
    expect(parishesInRlmas.size).toBe(PARISHES.length)
  })

  it("rlmaForParish resolves every parish", () => {
    for (const parish of PARISHES) {
      const rlma = rlmaForParish(parish.id)
      expect(rlma?.id).toBe(parish.rlma)
    }
    expect(rlmaForParish("made-up")).toBeUndefined()
  })

  it("parishById round-trips", () => {
    const orleans = parishById("orleans")
    expect(orleans?.name).toBe("Orleans")
  })

  it("every employer maps to at least one real parish", () => {
    const parishIds = new Set(PARISHES.map((p) => p.id))
    for (const employer of EMPLOYERS) {
      expect(employer.parishIds.length).toBeGreaterThan(0)
      for (const pid of employer.parishIds) {
        expect(parishIds.has(pid), `employer ${employer.id} → unknown parish ${pid}`).toBe(true)
      }
    }
  })

  it("every employer maps to a real sector", () => {
    const sectorIds = new Set(SECTORS.map((s) => s.id))
    for (const employer of EMPLOYERS) {
      expect(sectorIds.has(employer.sector)).toBe(true)
    }
  })

  it("employersInParish matches parish employer refs", () => {
    const richlandEmployers = employersInParish("richland")
    expect(richlandEmployers.map((e) => e.id)).toContain("meta-hyperion")

    const bossierEmployers = employersInParish("bossier")
    expect(bossierEmployers.map((e) => e.id)).toContain("amazon-aws")
  })

  it("employersInRLMA aggregates across all RLMA parishes", () => {
    const rlma8 = employersInRLMA("RLMA-8")
    expect(rlma8.map((e) => e.id)).toContain("meta-hyperion")

    const rlma7 = employersInRLMA("RLMA-7")
    expect(rlma7.map((e) => e.id)).toContain("amazon-aws")
  })

  it("each RLMA anchor project references a real megaproject employer", () => {
    const megaprojects = EMPLOYERS.filter((e) => e.isMegaproject).map(
      (e) => e.name.toLowerCase(),
    )
    for (const rlma of RLMAS) {
      if (rlma.anchorProject.toLowerCase().includes("offshore")) continue
      if (rlma.anchorProject.toLowerCase().includes("fort johnson")) continue
      if (rlma.anchorProject.toLowerCase().includes("oilfield")) continue
      if (rlma.anchorProject.toLowerCase().includes("lng")) continue

      const anchorMatches = megaprojects.some((m) =>
        rlma.anchorProject.toLowerCase().includes(m.split(/[ (—/]/)[0]!),
      )
      expect(anchorMatches, `RLMA ${rlma.id} anchor: ${rlma.anchorProject}`).toBe(true)
    }
  })
})
