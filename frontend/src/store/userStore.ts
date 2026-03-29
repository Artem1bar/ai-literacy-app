import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserRole } from "@/data/types"

interface UserState {
  role: UserRole | null
  setRole: (role: UserRole) => void
  clearRole: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      clearRole: () => set({ role: null }),
    }),
    { name: "ai-literacy-user" },
  ),
)
