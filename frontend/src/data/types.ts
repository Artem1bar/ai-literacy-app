// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  User role + module content types (existing — untouched semantics)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type UserRole = "student" | "professor" | "developer" | "worker"

export interface RoleConfig {
  readonly id: UserRole
  readonly label: string
  readonly description: string
  readonly icon: string
  readonly color: string
}

// Content block discriminated union
export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | CodeBlock
  | CalloutBlock
  | ImageBlock
  | QuizBlock
  | DividerBlock

export interface HeadingBlock {
  readonly type: "heading"
  readonly level: 2 | 3 | 4
  readonly text: string
}

export interface ParagraphBlock {
  readonly type: "paragraph"
  readonly text: string
}

export interface ListBlock {
  readonly type: "list"
  readonly style: "ordered" | "unordered"
  readonly items: readonly string[]
}

export interface CodeBlock {
  readonly type: "code"
  readonly language: string
  readonly code: string
  readonly caption?: string
}

export interface CalloutBlock {
  readonly type: "callout"
  readonly variant: "info" | "warning" | "tip" | "important"
  readonly title?: string
  readonly text: string
}

export interface ImageBlock {
  readonly type: "image"
  readonly src: string
  readonly alt: string
  readonly caption?: string
}

export interface QuizBlock {
  readonly type: "quiz"
  readonly id: string
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

export interface DividerBlock {
  readonly type: "divider"
}

export interface Section {
  readonly id: string
  readonly title: string
  readonly blocks: readonly ContentBlock[]
}

/** Which AI-literacy dimensions a module strengthens. Used for path derivation. */
export type LiteracyDimension =
  | "technical"
  | "critical"
  | "ethical"
  | "domain-specific"

/** A seedable Lab challenge associated with a module. */
export interface LabChallenge {
  readonly title: string
  readonly brief: string
  readonly starterPrompt: string
}

export interface Module {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly roles: readonly UserRole[]
  readonly estimatedMinutes: number
  readonly prerequisites: readonly string[]
  readonly sections: readonly Section[]
  /** Optional — used by the Phase 2 curriculum service to derive per-SOC paths. */
  readonly dimensions?: readonly LiteracyDimension[]
  /** Optional challenge that can be seeded into the Prompt Lab. */
  readonly labChallenge?: LabChallenge
}

export interface TemplatePlaceholder {
  readonly key: string
  readonly label: string
  readonly type: "text" | "textarea" | "select"
  readonly options?: readonly string[]
  readonly defaultValue?: string
}

export interface PromptTemplate {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: "student" | "professor" | "developer" | "general"
  readonly roles: readonly UserRole[]
  readonly framework: string
  readonly template: string
  readonly placeholders: readonly TemplatePlaceholder[]
}

export interface FrameworkStep {
  readonly key: string
  readonly label: string
  readonly description: string
  readonly placeholder: string
}

export interface PromptFramework {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly steps: readonly FrameworkStep[]
  readonly assembler: (values: Record<string, string>) => string
}

export interface Resource {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly url: string
  readonly category: ResourceCategory
  readonly roles: readonly UserRole[]
  readonly tags: readonly string[]
}

export type ResourceCategory =
  | "official-docs"
  | "ai-literacy-frameworks"
  | "prompt-engineering"
  | "github-repos"
  | "research-papers"
  | "tools-plugins"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Louisiana geography — parishes, RLMAs, sectors, employers
//  (plan §louisianaContext, P1-T3)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type RLMAId =
  | "RLMA-1"
  | "RLMA-2"
  | "RLMA-3"
  | "RLMA-4"
  | "RLMA-5"
  | "RLMA-6"
  | "RLMA-7"
  | "RLMA-8"

export interface RLMA {
  readonly id: RLMAId
  readonly name: string
  readonly description: string
  readonly anchorProject: string
  readonly parishIds: readonly string[]
}

export interface Parish {
  readonly id: string
  readonly name: string
  readonly rlma: RLMAId
  readonly population: number | null
  readonly medianHouseholdIncome: number | null
  readonly majorEmployerIds: readonly string[]
  readonly sourceCitation: string
}

export type SectorId =
  | "energy-petrochemicals"
  | "manufacturing"
  | "healthcare"
  | "logistics-ports"
  | "agriculture"
  | "finance-insurance"
  | "education"
  | "public-administration"
  | "technology"
  | "construction"
  | "retail-hospitality"

export interface Sector {
  readonly id: SectorId
  readonly label: string
  readonly description: string
  readonly relatedNAICS: readonly string[]
}

export interface Employer {
  readonly id: string
  readonly name: string
  readonly sector: SectorId
  readonly parishIds: readonly string[]
  readonly isPriorityLA: boolean
  readonly isMegaproject: boolean
  readonly description: string
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Per-SOC occupation model (plan §newDataSchemas, P1-T1)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ConfidenceLevel = "low" | "medium" | "high"

export interface SourceCitation {
  /** Stable id from `dataSources` in IMPROVEMENT_PLAN.json. */
  readonly sourceId: string
  /** Human-readable label shown in UI footnotes. */
  readonly label: string
  /** Optional URL — may be blank if source is a paper, not a live page. */
  readonly url?: string
  /** ISO year this source reflects (e.g. "2024", "2025"). */
  readonly asOf: string
}

export interface ScoreMetric {
  /** 0–100 scale. For wagePremium, the unit is percent uplift (can exceed 100). */
  readonly value: number
  readonly confidence: ConfidenceLevel
  readonly source: SourceCitation
  /** ISO date the value was last computed or reviewed. */
  readonly lastComputed: string
  /** Optional qualitative note shown under the metric. */
  readonly note?: string
}

export interface SOCScoreCard {
  readonly exposure: ScoreMetric
  readonly augmentation: ScoreMetric
  readonly replacement: ScoreMetric
  readonly wagePremium: ScoreMetric
}

export type SkillPriority = "core" | "supporting" | "stretch"

export interface SkillItem {
  readonly id: string
  readonly title: string
  readonly summary: string
  readonly dimension: LiteracyDimension
  readonly priority: SkillPriority
  /** Optional O*NET task id ("1.A.1.a.1") or free-text task this skill anchors to. */
  readonly anchorTask?: string
  /** Optional slug of a glossary term that underpins this skill. */
  readonly glossarySlug?: string
}

export interface SkillBundle {
  readonly technical: readonly SkillItem[]
  readonly critical: readonly SkillItem[]
  readonly ethical: readonly SkillItem[]
  readonly domainSpecific: readonly SkillItem[]
}

export interface ModuleRef {
  /** Matches Module.id from modules.ts. */
  readonly moduleId: string
  /** 1-based ordinal within the path. */
  readonly order: number
  /** Why this module is recommended for this SOC. */
  readonly rationale: string
  /** Which literacy dimensions this step covers. */
  readonly covers: readonly LiteracyDimension[]
}

export interface ResourceRef {
  /** Matches Resource.id from resources.ts. */
  readonly resourceId: string
  readonly rationale: string
}

export interface Milestone {
  readonly id: string
  readonly label: string
  readonly afterModuleId: string
  readonly description: string
}

export interface LearningPath {
  readonly socCode: string
  readonly recommendedModules: readonly ModuleRef[]
  readonly supplementalResources: readonly ResourceRef[]
  readonly estimatedTotalMinutes: number
  readonly milestones: readonly Milestone[]
}

/** % of LA workers in this SOC located in each RLMA. Keys sum to ~100. */
export type RLMADistribution = Partial<Readonly<Record<RLMAId, number>>>

export interface SOCOccupation {
  /** 6-digit SOC code, e.g. "51-4121" (welder) — dot-suffix for detailed variants. */
  readonly code: string
  readonly title: string
  /** O*NET broad job family for search/grouping. */
  readonly jobFamily: string
  /** Louisiana employment count per BLS OEWS; null when suppressed/unpublished. */
  readonly laEmployment: number | null
  /** BLS OEWS LA annual median wage in USD; null when suppressed. */
  readonly laMedianWage: number | null
  readonly rlmaDistribution: RLMADistribution
  readonly relatedSOCs: readonly string[]
  readonly typicalEmployerIds: readonly string[]
  readonly sectorIds: readonly SectorId[]
  readonly scoreCard: SOCScoreCard
  readonly skillBundle: SkillBundle
  readonly learningPath: LearningPath
  readonly summary: string
  readonly sourceCitations: readonly SourceCitation[]
  readonly lastReviewed: string
}

/** Type guard: does this SOC appear in the MVP priority list? */
export function isPrioritySOC(soc: SOCOccupation): boolean {
  return soc.laEmployment !== null && soc.laEmployment >= 5_000
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Glossary (P1-T2)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type GlossaryCategory =
  | "ai-concepts"
  | "la-workforce"
  | "methodology"
  | "tools"
  | "frameworks"

export interface GlossarySeeAlso {
  readonly label: string
  readonly url: string
}

export interface GlossaryTerm {
  /** URL-safe kebab-case, e.g. "context-window". */
  readonly slug: string
  readonly term: string
  /** Tooltip-length definition (≤120 chars). */
  readonly short: string
  /** Full markdown definition. */
  readonly long: string
  readonly category: GlossaryCategory
  readonly relatedSlugs: readonly string[]
  readonly seeAlso: readonly GlossarySeeAlso[]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  User profile & diagnostic assessment (P1-T4, P3-T6)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface AssessmentAnswerMap {
  readonly [questionId: string]: string
}

export interface AssessmentSuggestion {
  readonly socCode: string
  /** 0-1 — weighted match score from the lookup table. */
  readonly confidence: number
  readonly rationale: string
}

export interface AssessmentResult {
  readonly completedAt: string
  readonly answers: AssessmentAnswerMap
  readonly suggestions: readonly AssessmentSuggestion[]
}

export interface UserProfile {
  readonly role: UserRole | null
  readonly socCode: string | null
  readonly parishId: string | null
  readonly rlma: RLMAId | null
  readonly sectorId: SectorId | null
  readonly currentEmployerId: string | null
  readonly assessmentResult: AssessmentResult | null
}

export const EMPTY_PROFILE: UserProfile = {
  role: null,
  socCode: null,
  parishId: null,
  rlma: null,
  sectorId: null,
  currentEmployerId: null,
  assessmentResult: null,
}
