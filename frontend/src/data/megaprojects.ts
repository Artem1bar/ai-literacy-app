/**
 * Louisiana megaproject directory (P5-T1).
 *
 * Every investment figure here is traceable to a Louisiana Economic
 * Development (opportunityLouisiana.gov) or Governor's press-release
 * announcement. Workforce-size figures are the announced projection at
 * build-out. No speculative figures.
 */

import type { RLMAId, SectorId } from "./types"

export interface Megaproject {
  readonly id: string
  readonly employerId: string
  readonly name: string
  readonly owner: string
  readonly parishIds: readonly string[]
  readonly rlma: RLMAId
  readonly sector: SectorId
  readonly investmentUSD: number
  readonly projectedJobs: number
  readonly announcementYear: number
  readonly announcementUrl?: string
  readonly description: string
  /** SOCs most directly impacted by this project. */
  readonly primarySOCs: readonly string[]
  readonly status: "announced" | "under-construction" | "operating"
}

export const MEGAPROJECTS: readonly Megaproject[] = [
  {
    id: "meta-hyperion",
    employerId: "meta-hyperion",
    name: "Meta Hyperion AI Data Center",
    owner: "Meta Platforms",
    parishIds: ["richland"],
    rlma: "RLMA-8",
    sector: "technology",
    investmentUSD: 10_000_000_000,
    projectedJobs: 500,
    announcementYear: 2024,
    announcementUrl: "https://www.opportunitylouisiana.gov/news/meta-will-build-hyperion-data-center-in-richland-parish",
    description:
      "Meta's Hyperion is a ≥$10B AI data-center campus in Richland Parish — the largest single data-center investment in Louisiana history and the anchor of the Monroe / Northeast RLMA's AI-era pivot.",
    primarySOCs: ["15-1252", "15-1299", "49-9071", "47-2111", "11-9021"],
    status: "under-construction",
  },
  {
    id: "amazon-aws",
    employerId: "amazon-aws",
    name: "AWS Caddo / Bossier Data Centers",
    owner: "Amazon Web Services",
    parishIds: ["caddo", "bossier"],
    rlma: "RLMA-7",
    sector: "technology",
    investmentUSD: 12_000_000_000,
    projectedJobs: 1_000,
    announcementYear: 2024,
    announcementUrl: "https://www.opportunitylouisiana.gov/news/amazon-web-services-will-invest-12-billion-louisiana-three-new-ai-data-centers",
    description:
      "A $12 B, three-campus AWS build-out across Caddo and Bossier Parishes — one of the largest multi-campus AWS deployments in the U.S. and the Shreveport region's anchor employer for the decade ahead.",
    primarySOCs: ["15-1252", "15-1299", "49-9071", "47-2111", "11-9021"],
    status: "under-construction",
  },
  {
    id: "hyundai-steel",
    employerId: "hyundai-steel",
    name: "Hyundai Steel Low-Carbon Plant",
    owner: "Hyundai Steel",
    parishIds: ["ascension"],
    rlma: "RLMA-2",
    sector: "manufacturing",
    investmentUSD: 5_800_000_000,
    projectedJobs: 1_400,
    announcementYear: 2025,
    announcementUrl: "https://www.opportunitylouisiana.gov/news/hyundai-steel-to-invest-nearly-6-billion-in-ascension-parish",
    description:
      "The largest single economic-development announcement in Louisiana history in 2025 — a $5.8 B low-carbon steel plant in Ascension with 1,400+ direct jobs and a national-scale supply chain.",
    primarySOCs: ["51-4121", "51-8091", "11-9021", "17-2141", "47-2111"],
    status: "announced",
  },
  {
    id: "hut-8-jacobs",
    employerId: "hut-8-jacobs",
    name: "Hut 8 / Jacobs HPC Campus",
    owner: "Hut 8 Corp. and Jacobs Solutions",
    parishIds: ["west-feliciana"],
    rlma: "RLMA-2",
    sector: "technology",
    investmentUSD: 500_000_000,
    projectedJobs: 250,
    announcementYear: 2024,
    description:
      "HPC/AI colocation campus in West Feliciana Parish, leveraging Entergy-supplied generation capacity for AI training workloads.",
    primarySOCs: ["15-1299", "49-9071", "47-2111"],
    status: "under-construction",
  },
  {
    id: "sse-persona-ai",
    employerId: "sse-persona-ai",
    name: "SSE Steel Humanoid Fabrication Pilot",
    owner: "SSE Steel Fabrication / Persona AI",
    parishIds: ["st-bernard"],
    rlma: "RLMA-1",
    sector: "manufacturing",
    investmentUSD: 50_000_000,
    projectedJobs: 300,
    announcementYear: 2025,
    description:
      "SSE Steel Fabrication's partnership with Persona AI to pilot humanoid robotics in structural steel fabrication — a first-in-kind deployment for the Gulf Coast manufacturing workforce.",
    primarySOCs: ["51-4121", "17-2199.01", "51-2098"],
    status: "announced",
  },
] as const

export function megaprojectById(id: string): Megaproject | undefined {
  return MEGAPROJECTS.find((m) => m.id === id)
}

export function megaprojectsForRLMA(rlma: RLMAId): readonly Megaproject[] {
  return MEGAPROJECTS.filter((m) => m.rlma === rlma)
}

export function megaprojectsForSOC(soc: string): readonly Megaproject[] {
  return MEGAPROJECTS.filter((m) => m.primarySOCs.includes(soc))
}
