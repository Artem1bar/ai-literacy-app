import { create } from "zustand"

export interface LabSeed {
  readonly id: string
  readonly prompt: string
  readonly source: {
    readonly moduleId: string
    readonly moduleTitle: string
    readonly challengeTitle: string
  }
}

export type NewLabSeed = Omit<LabSeed, "id">

interface LabSeedState {
  seed: LabSeed | null
  // Set a fresh seed. Assigns a new id so consumers can dedupe by identity.
  setSeed: (seed: NewLabSeed) => void
  // Read the current seed WITHOUT clearing it. Idempotent across remounts.
  peekSeed: () => LabSeed | null
  // Explicitly clear the seed — call after the user acts (clear/dismiss)
  // or when setting a new seed supersedes an old one.
  clearSeed: () => void
}

function makeSeedId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const useLabSeedStore = create<LabSeedState>((set, get) => ({
  seed: null,
  setSeed: (seed) => set({ seed: { ...seed, id: makeSeedId() } }),
  peekSeed: () => get().seed,
  clearSeed: () => set({ seed: null }),
}))
