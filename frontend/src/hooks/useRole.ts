import { useUserStore } from "@/store/userStore"
import { USER_ROLES } from "@/data/user-roles"

export function useRole() {
  const role = useUserStore((s) => s.role)
  const setRole = useUserStore((s) => s.setRole)
  const clearRole = useUserStore((s) => s.clearRole)
  const roleConfig = USER_ROLES.find((r) => r.id === role) ?? null
  return { role, roleConfig, setRole, clearRole }
}
