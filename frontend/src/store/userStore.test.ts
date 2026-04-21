import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { USER_STORAGE_KEY, useUserStore } from "./userStore"
import { EMPTY_PROFILE } from "@/data/types"

function resetStore() {
  useUserStore.setState({ profile: EMPTY_PROFILE })
  window.localStorage.clear()
}

describe("useUserStore", () => {
  beforeEach(() => resetStore())
  afterEach(() => resetStore())

  it("starts with an empty profile", () => {
    expect(useUserStore.getState().profile).toEqual(EMPTY_PROFILE)
    expect(useUserStore.getState().profile.role).toBeNull()
  })

  it("setRole writes through to profile.role", () => {
    useUserStore.getState().setRole("worker")
    expect(useUserStore.getState().profile.role).toBe("worker")
  })

  it("setSOC writes through", () => {
    useUserStore.getState().setSOC("51-4121")
    expect(useUserStore.getState().profile.socCode).toBe("51-4121")
  })

  it("setParish also derives the RLMA", () => {
    useUserStore.getState().setParish("richland")
    const { profile } = useUserStore.getState()
    expect(profile.parishId).toBe("richland")
    expect(profile.rlma).toBe("RLMA-8")

    useUserStore.getState().setParish(null)
    expect(useUserStore.getState().profile.rlma).toBeNull()
  })

  it("clearProfile resets everything", () => {
    const s = useUserStore.getState()
    s.setRole("worker")
    s.setSOC("51-4121")
    s.setParish("caddo")
    s.setSector("technology")
    s.clearProfile()
    expect(useUserStore.getState().profile).toEqual(EMPTY_PROFILE)
  })
})

describe("userStore v0 → v1 migration", () => {
  afterEach(() => resetStore())

  it("upgrades a role-only localStorage record to the new profile shape without data loss", async () => {
    // Seed the persisted envelope Zustand produced in v0: { state: { role }, version: 0 }
    const legacy = {
      state: { role: "developer" },
      version: 0,
    }
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(legacy))

    // Rehydrate — Zustand's persist middleware will invoke `migrate` on read.
    await useUserStore.persist.rehydrate()

    const { profile } = useUserStore.getState()
    expect(profile.role).toBe("developer")
    expect(profile.socCode).toBeNull()
    expect(profile.parishId).toBeNull()
    expect(profile.rlma).toBeNull()
  })

  it("leaves a v1 record untouched", async () => {
    const current = {
      state: {
        profile: {
          ...EMPTY_PROFILE,
          role: "worker",
          socCode: "51-4121",
          parishId: "caddo",
          rlma: "RLMA-7",
        },
      },
      version: 1,
    }
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(current))
    await useUserStore.persist.rehydrate()

    const { profile } = useUserStore.getState()
    expect(profile.role).toBe("worker")
    expect(profile.socCode).toBe("51-4121")
    expect(profile.rlma).toBe("RLMA-7")
  })
})
