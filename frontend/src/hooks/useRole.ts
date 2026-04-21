import { useUserStore, selectRole } from "@/store/userStore"
import { USER_ROLES } from "@/data/user-roles"

/**
 * Legacy hook — exposes role-only access for components that haven't been
 * migrated to the fuller `useProfile` hook yet. Both read from the same
 * underlying store, so they stay in sync.
 */
export function useRole() {
  const role = useUserStore(selectRole)
  const setRole = useUserStore((s) => s.setRole)
  const clearRole = useUserStore((s) => s.clearRole)
  const roleConfig = USER_ROLES.find((r) => r.id === role) ?? null
  return { role, roleConfig, setRole, clearRole }
}
