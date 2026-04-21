import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  EMPTY_PROFILE,
  type AssessmentResult,
  type RLMAId,
  type SectorId,
  type UserProfile,
  type UserRole,
} from "@/data/types"
import { rlmaForParish } from "@/data/louisiana"

export const USER_STORAGE_KEY = "ai-literacy-user"

interface UserState {
  profile: UserProfile
  setRole: (role: UserRole) => void
  setSOC: (socCode: string | null) => void
  setParish: (parishId: string | null) => void
  setSector: (sectorId: SectorId | null) => void
  setEmployer: (employerId: string | null) => void
  setAssessmentResult: (result: AssessmentResult | null) => void
  clearProfile: () => void
  /** Back-compat: alias for clearing only the role. */
  clearRole: () => void
}

interface LegacyStateV0 {
  role?: UserRole | null
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: EMPTY_PROFILE,
      setRole: (role) =>
        set((state) => ({
          profile: { ...state.profile, role },
        })),
      setSOC: (socCode) =>
        set((state) => ({
          profile: { ...state.profile, socCode },
        })),
      setParish: (parishId) =>
        set((state) => {
          const rlma: RLMAId | null = parishId
            ? (rlmaForParish(parishId)?.id ?? null)
            : null
          return { profile: { ...state.profile, parishId, rlma } }
        }),
      setSector: (sectorId) =>
        set((state) => ({
          profile: { ...state.profile, sectorId },
        })),
      setEmployer: (employerId) =>
        set((state) => ({
          profile: { ...state.profile, currentEmployerId: employerId },
        })),
      setAssessmentResult: (result) =>
        set((state) => ({
          profile: { ...state.profile, assessmentResult: result },
        })),
      clearProfile: () => set({ profile: EMPTY_PROFILE }),
      clearRole: () =>
        set((state) => ({
          profile: { ...state.profile, role: null },
        })),
    }),
    {
      name: USER_STORAGE_KEY,
      version: 1,
      /** v0 (role-only) → v1 (full profile). Preserves whatever role was set. */
      migrate: (persisted, version) => {
        if (version < 1 && persisted && typeof persisted === "object") {
          const legacy = persisted as LegacyStateV0
          const role = legacy.role ?? null
          return { profile: { ...EMPTY_PROFILE, role } }
        }
        return persisted as { profile: UserProfile }
      },
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
)

/** Stable selector for the current role. */
export const selectRole = (s: UserState): UserRole | null => s.profile.role
