import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ProgressState {
  completed: Record<string, string[]> // moduleId → completed sectionIds
  quizScores: Record<string, number> // quizId → score (0 or 1)
  markSectionComplete: (moduleId: string, sectionId: string) => void
  markSectionIncomplete: (moduleId: string, sectionId: string) => void
  saveQuizScore: (quizId: string, score: number) => void
  getModuleProgress: (moduleId: string, totalSections: number) => number
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      quizScores: {},

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

      getModuleProgress: (moduleId, totalSections) => {
        const completed = get().completed[moduleId] ?? []
        if (totalSections === 0) return 0
        return Math.round((completed.length / totalSections) * 100)
      },

      resetProgress: () => set({ completed: {}, quizScores: {} }),
    }),
    { name: "ai-literacy-progress" },
  ),
)
