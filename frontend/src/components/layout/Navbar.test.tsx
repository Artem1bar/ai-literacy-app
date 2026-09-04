import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/lib/constants", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/constants")>()),
  BACKEND_ENABLED: false,
}))

import { Navbar } from "./Navbar"

describe("Navbar in a static build", () => {
  it("does not offer the Prompt Lab or Occupations", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    expect(screen.getAllByRole("link", { name: "Learn" }).length).toBeGreaterThan(0)
    expect(screen.queryByRole("link", { name: "Prompt Lab" })).toBeNull()
    expect(screen.queryByRole("link", { name: "Occupations" })).toBeNull()
    expect(screen.queryByRole("link", { name: "Megaprojects" })).toBeNull()
  })
})
