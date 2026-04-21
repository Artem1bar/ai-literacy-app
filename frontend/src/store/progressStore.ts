import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface QuizAttempt {
  readonly score: number // 0 or 1
  readonly lastAttemptAt: number // epoch ms
  readonly attempts: number
  readonly moduleId: string
  readonly sectionId: string
}

interface ProgressState {
  completed: Record<string, string[]> // moduleId → completed sectionIds
  quizScores: Record<string, number> // quizId → score (0 or 1) — legacy, kept for compatibility
  quizAttempts: Record<string, QuizAttempt> // quizId → attempt metadata
  markSectionComplete: (moduleId: string, sectionId: string) => void
  markSectionIncomplete: (moduleId: string, sectionId: string) => void
  saveQuizScore: (quizId: string, score: number) => void
  recordQuizAttempt: (args: {
    quizId: string
    score: number
    moduleId: string
    sectionId: string
  }) => void
  getModuleProgress: (moduleId: string, totalSections: number) => number
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      quizScores: {},
      quizAttempts: {},

      markSectionComplete: (moduleId, sectionId) =>
        set((state) => {
          const existing = state.completed[moduleId] ?? []
          if (existing.includes(sectionId)) return state
          return {
            completed: {
              ...state.completed,
              [moduleId]: [...existing, sectionId],
            },
          }
        }),

      markSectionIncomplete: (moduleId, sectionId) =>
        set((state) => ({
          completed: {
            ...state.completed,
            [moduleId]: (state.completed[moduleId] ?? []).filter(
              (id) => id !== sectionId,
            ),
          },
        })),

      saveQuizScore: (quizId, score) =>
        set((state) => ({
          quizScores: { ...state.quizScores, [quizId]: score },
        })),

      recordQuizAttempt: ({ quizId, score, moduleId, sectionId }) =>
        set((state) => {
          const prev = state.quizAttempts[quizId]
          return {
            quizScores: { ...state.quizScores, [quizId]: score },
            quizAttempts: {
              ...state.quizAttempts,
              [quizId]: {
                score,
                lastAttemptAt: Date.now(),
                attempts: (prev?.attempts ?? 0) + 1,
                moduleId,
                sectionId,
              },
            },
          }
        }),

      getModuleProgress: (moduleId, totalSections) => {
        const completed = get().completed[moduleId] ?? []
        if (totalSections === 0) return 0
        return Math.round((completed.length / totalSections) * 100)
      },

      resetProgress: () =>
        set({ completed: {}, quizScores: {}, quizAttempts: {} }),
    }),
    { name: "ai-literacy-progress" },
  ),
)
