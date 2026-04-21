/**
 * Diagnostic assessment — maps user answers to candidate Louisiana SOCs.
 *
 * Each question attaches a per-option weight map keyed by SOC code. On
 * submission, we sum weights across answers and return the top-N candidates
 * with a normalised confidence.
 */

import type { AssessmentAnswerMap, AssessmentSuggestion } from "./types"

export interface AssessmentOption {
  readonly value: string
  readonly label: string
  readonly description?: string
  readonly weights: Readonly<Record<string, number>>
}

export interface AssessmentQuestion {
  readonly id: string
  readonly prompt: string
  readonly options: readonly AssessmentOption[]
}

export type { AssessmentAnswerMap } from "./types"

const w = (obj: Record<string, number>) => obj

export const ASSESSMENT_QUESTIONS: readonly AssessmentQuestion[] = [
  {
    id: "primary-activity",
    prompt: "Which of these best describes what you do most of the day?",
    options: [
      {
        value: "build-physical",
        label: "Build, fabricate, or install something physical",
        description: "Welding, electrical, HVAC, steel, construction.",
        weights: w({
          "51-4121": 3,
          "47-2111": 3,
          "47-2211": 3,
          "51-2098": 2,
          "11-9021": 1,
          "49-9071": 1,
        }),
      },
      {
        value: "operate-equipment",
        label: "Operate equipment, vehicles, or industrial systems",
        description: "Process plants, power plants, trucks, forklifts.",
        weights: w({
          "51-8091": 3,
          "51-8013": 3,
          "53-3032": 3,
          "53-7051": 3,
        }),
      },
      {
        value: "care-for-people",
        label: "Care for patients, students, or clients",
        description: "Nursing, teaching, social work, direct-service roles.",
        weights: w({
          "29-1141": 3,
          "29-1171": 3,
          "29-2061": 3,
          "31-1131": 3,
          "25-2021": 2,
          "25-2031": 2,
        }),
      },
      {
        value: "work-with-numbers",
        label: "Work with numbers, financial records, or data",
        description: "Accounting, analysis, finance, research.",
        weights: w({
          "13-2011": 3,
          "13-1111": 3,
        }),
      },
      {
        value: "serve-communicate",
        label: "Serve customers, coordinate, or communicate",
        description: "Customer service, admin, planning.",
        weights: w({
          "43-4051": 3,
          "43-6011": 3,
          "43-5061": 2,
        }),
      },
      {
        value: "write-code",
        label: "Write software or design technical systems",
        description: "Software, data center ops, robotics.",
        weights: w({
          "15-1252": 3,
          "15-1299": 3,
          "17-2199.01": 3,
        }),
      },
      {
        value: "manage-people",
        label: "Manage people or organisations",
        description: "Operations manager, supervisor, director.",
        weights: w({
          "11-1021": 3,
          "11-9021": 2,
        }),
      },
      {
        value: "teach",
        label: "Teach or train others",
        description: "Classroom teaching, postsecondary, corporate training.",
        weights: w({
          "25-2021": 3,
          "25-2031": 3,
          "25-1011": 3,
        }),
      },
    ],
  },
  {
    id: "tools",
    prompt: "Which tools do you use most often?",
    options: [
      {
        value: "physical-tools",
        label: "Physical tools — welders, wrenches, test equipment",
        weights: w({
          "51-4121": 2,
          "47-2111": 2,
          "47-2211": 2,
          "49-9071": 2,
        }),
      },
      {
        value: "control-systems",
        label: "DCS / SCADA / plant control systems",
        weights: w({ "51-8091": 3, "51-8013": 3 }),
      },
      {
        value: "ehr-clinical",
        label: "Electronic health records (Epic, Cerner) or clinical systems",
        weights: w({ "29-1141": 3, "29-1171": 3, "29-2061": 3, "31-1131": 2 }),
      },
      {
        value: "accounting-bi",
        label: "Accounting / BI / ERP software",
        weights: w({ "13-2011": 3, "13-1111": 2 }),
      },
      {
        value: "office-suite",
        label: "Office / email / calendar / CRM",
        weights: w({ "43-4051": 2, "43-6011": 3, "11-1021": 1 }),
      },
      {
        value: "code-editor",
        label: "IDE / terminal / Git",
        weights: w({ "15-1252": 3, "15-1299": 2, "17-2199.01": 2 }),
      },
      {
        value: "cad-design",
        label: "CAD / 3D design / simulation",
        weights: w({ "17-2199.01": 2, "11-9021": 1 }),
      },
      {
        value: "lms-classroom",
        label: "LMS (Canvas, Blackboard) or classroom tools",
        weights: w({ "25-2021": 3, "25-2031": 3, "25-1011": 3 }),
      },
    ],
  },
  {
    id: "decision-authority",
    prompt: "What scope of decision do you make independently?",
    options: [
      {
        value: "follow-standard",
        label: "Follow standard procedures",
        weights: w({
          "43-4051": 1,
          "53-7051": 1,
          "31-1131": 1,
          "51-2098": 1,
        }),
      },
      {
        value: "craft-judgment",
        label: "Apply craft judgment to real-world situations",
        weights: w({
          "51-4121": 2,
          "47-2111": 2,
          "51-8091": 2,
          "29-2061": 2,
          "51-8013": 2,
        }),
      },
      {
        value: "professional-judgment",
        label: "Exercise licensed/professional judgment",
        weights: w({
          "29-1141": 3,
          "29-1171": 3,
          "13-2011": 3,
          "25-2021": 2,
          "25-2031": 2,
          "25-1011": 2,
        }),
      },
      {
        value: "multi-team",
        label: "Coordinate across teams or lead projects",
        weights: w({
          "11-1021": 3,
          "11-9021": 3,
          "13-1111": 2,
          "17-2199.01": 1,
        }),
      },
      {
        value: "design-build",
        label: "Design and build new systems or products",
        weights: w({
          "15-1252": 3,
          "17-2199.01": 3,
          "15-1299": 2,
        }),
      },
    ],
  },
  {
    id: "industry",
    prompt: "Which industry are you closest to?",
    options: [
      {
        value: "energy",
        label: "Energy, petrochemicals, or LNG",
        weights: w({ "51-8091": 2, "51-8013": 2 }),
      },
      {
        value: "manufacturing",
        label: "Manufacturing or heavy industry",
        weights: w({ "51-4121": 2, "51-2098": 2, "17-2199.01": 1 }),
      },
      {
        value: "healthcare",
        label: "Healthcare",
        weights: w({ "29-1141": 2, "29-1171": 2, "29-2061": 2, "31-1131": 2 }),
      },
      {
        value: "tech",
        label: "Technology / data centers",
        weights: w({ "15-1252": 2, "15-1299": 2 }),
      },
      {
        value: "ports-logistics",
        label: "Ports, logistics, or transportation",
        weights: w({ "53-7051": 2, "53-3032": 2, "43-5061": 2 }),
      },
      {
        value: "finance",
        label: "Finance, accounting, or professional services",
        weights: w({ "13-2011": 2, "13-1111": 2, "43-6011": 1 }),
      },
      {
        value: "education",
        label: "Education",
        weights: w({ "25-2021": 2, "25-2031": 2, "25-1011": 2 }),
      },
      {
        value: "public",
        label: "Government or public sector",
        weights: w({ "11-1021": 1, "43-6011": 2 }),
      },
    ],
  },
  {
    id: "output-type",
    prompt: "What does a 'finished piece of work' look like in your job?",
    options: [
      {
        value: "physical-thing",
        label: "A physical object, install, or repair",
        weights: w({ "51-4121": 2, "47-2111": 2, "47-2211": 2, "49-9071": 2 }),
      },
      {
        value: "operating-shift",
        label: "A shift of equipment running safely",
        weights: w({ "51-8091": 2, "51-8013": 2, "53-3032": 1, "53-7051": 1 }),
      },
      {
        value: "patient-record",
        label: "A cared-for patient or completed chart",
        weights: w({ "29-1141": 2, "29-2061": 2, "31-1131": 2, "29-1171": 2 }),
      },
      {
        value: "report",
        label: "A written report, analysis, or plan",
        weights: w({ "13-2011": 2, "13-1111": 2, "11-1021": 1 }),
      },
      {
        value: "resolved-ticket",
        label: "A resolved customer request",
        weights: w({ "43-4051": 2, "43-6011": 2 }),
      },
      {
        value: "shipped-code",
        label: "Shipped software, automation, or a system",
        weights: w({ "15-1252": 2, "15-1299": 2, "17-2199.01": 2 }),
      },
      {
        value: "teaching-session",
        label: "A taught class or trained cohort",
        weights: w({ "25-2021": 2, "25-2031": 2, "25-1011": 2 }),
      },
    ],
  },
]

interface RationaleBuckets {
  readonly [socCode: string]: readonly string[]
}

export function suggestSOCs(
  answers: AssessmentAnswerMap,
  limit = 3,
): readonly AssessmentSuggestion[] {
  const scores = new Map<string, number>()
  const rationales: Record<string, string[]> = {}

  for (const q of ASSESSMENT_QUESTIONS) {
    const pick = answers[q.id]
    if (!pick) continue
    const opt = q.options.find((o) => o.value === pick)
    if (!opt) continue
    for (const [soc, wt] of Object.entries(opt.weights)) {
      scores.set(soc, (scores.get(soc) ?? 0) + wt)
      rationales[soc] = rationales[soc] ?? []
      rationales[soc]!.push(`${q.id}: ${opt.label}`)
    }
  }

  if (scores.size === 0) return []

  const max = Math.max(...scores.values())
  const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1])

  const out: AssessmentSuggestion[] = []
  for (const [soc, score] of sorted.slice(0, limit)) {
    out.push({
      socCode: soc,
      confidence: Math.min(1, score / max),
      rationale: (rationales as RationaleBuckets)[soc]!.slice(0, 2).join("; "),
    })
  }
  return out
}
