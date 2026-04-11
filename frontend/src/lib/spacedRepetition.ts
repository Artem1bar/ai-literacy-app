import { MODULES } from "@/data/modules"
import type { QuizAttempt } from "@/store/progressStore"
import type { QuizBlock } from "@/data/types"

export interface DueReview {
  readonly quizId: string
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
  readonly moduleId: string
  readonly moduleTitle: string
  readonly moduleSlug: string
  readonly sectionId: string
  readonly sectionTitle: string
  readonly lastScore: number
  readonly dueSince: number // ms since attempt — higher = more overdue
  readonly reason: "missed" | "interval"
}

// Simple Leitner-style intervals in days.
// Missed questions: always due the next day.
// Correct questions: spaced at 1d, 3d, 7d, 14d based on attempt count.
const MS_PER_DAY = 24 * 60 * 60 * 1000

function intervalForCorrectAttempt(attempts: number): number {
  if (attempts <= 1) return 1
  if (attempts === 2) return 3
  if (attempts === 3) return 7
  return 14
}

/**
 * Walks every quiz in every module, cross-references with attempts,
 * and returns the ones that are due for review.
 */
export function getDueReviews(
  quizAttempts: Record<string, QuizAttempt>,
  now: number = Date.now(),
): DueReview[] {
  const results: DueReview[] = []

  for (const module of MODULES) {
    for (const section of module.sections) {
      for (const block of section.blocks) {
        if (block.type !== "quiz") continue
        const quiz = block as QuizBlock
        const attempt = quizAttempts[quiz.id]
        if (!attempt) continue // never attempted — not a "review"

        const elapsedMs = now - attempt.lastAttemptAt
        const elapsedDays = elapsedMs / MS_PER_DAY

        const isDue =
          attempt.score === 0
            ? elapsedDays >= 1 // missed → always due after 1 day
            : elapsedDays >= intervalForCorrectAttempt(attempt.attempts)

        if (!isDue) continue

        results.push({
          quizId: quiz.id,
          question: quiz.question,
          options: quiz.options,
          correctIndex: quiz.correctIndex,
          explanation: quiz.explanation,
          moduleId: module.id,
          moduleTitle: module.title,
          moduleSlug: module.slug,
          sectionId: section.id,
          sectionTitle: section.title,
          lastScore: attempt.score,
          dueSince: elapsedMs,
          reason: attempt.score === 0 ? "missed" : "interval",
        })
      }
    }
  }

  // Missed first, then most overdue
  return results.sort((a, b) => {
    if (a.reason !== b.reason) return a.reason === "missed" ? -1 : 1
    return b.dueSince - a.dueSince
  })
}
