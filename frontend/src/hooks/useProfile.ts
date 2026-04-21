import { useUserStore } from "@/store/userStore"
import { USER_ROLES } from "@/data/user-roles"
import {
  employerById,
  parishById,
  rlmaForParish,
} from "@/data/louisiana"

/**
 * Reads and writes to the full user profile (role + SOC + parish + sector +
 * employer + assessment). Components that only need a single field should
 * select that field directly via `useUserStore` for narrower re-renders.
 */
export function useProfile() {
  const profile = useUserStore((s) => s.profile)
  const setRole = useUserStore((s) => s.setRole)
  const setSOC = useUserStore((s) => s.setSOC)
  const setParish = useUserStore((s) => s.setParish)
  const setSector = useUserStore((s) => s.setSector)
  const setEmployer = useUserStore((s) => s.setEmployer)
  const setAssessmentResult = useUserStore((s) => s.setAssessmentResult)
  const clearProfile = useUserStore((s) => s.clearProfile)

  const roleConfig = USER_ROLES.find((r) => r.id === profile.role) ?? null
  const parish = profile.parishId ? (parishById(profile.parishId) ?? null) : null
  const rlma = profile.parishId ? (rlmaForParish(profile.parishId) ?? null) : null
  const employer = profile.currentEmployerId
    ? (employerById(profile.currentEmployerId) ?? null)
    : null

  const hasRole = profile.role !== null
  const hasSOC = profile.socCode !== null
  const hasLocation = profile.parishId !== null
  const hasEmployer = profile.currentEmployerId !== null

  return {
    profile,
    roleConfig,
    parish,
    rlma,
    employer,
    hasRole,
    hasSOC,
    hasLocation,
    hasEmployer,
    setRole,
    setSOC,
    setParish,
    setSector,
    setEmployer,
    setAssessmentResult,
    clearProfile,
  }
}

/** Narrow selector: the current SOC code, if any. */
export function useSOC() {
  return useUserStore((s) => s.profile.socCode)
}

/** Narrow selector: the current RLMA id, if any. */
export function useRLMA() {
  return useUserStore((s) => s.profile.rlma)
}
