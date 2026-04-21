import { expect, test } from "@playwright/test"

/**
 * Lab round-trip smoke test (P0-T3).
 *
 * Intercepts the backend call so the test does not require a running FastAPI
 * server or a live Anthropic API key. The real round-trip is covered by the
 * backend pytest suite against a stubbed Claude client.
 */

test.describe("Prompt Lab", () => {
  test("submits a prompt and renders the response", async ({ page }) => {
    await page.route("**/api/prompt", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          content: "# Hello from Claude\n\nThis is an end-to-end test reply.",
          model: "claude-sonnet-4-6",
          usage: { input_tokens: 12, output_tokens: 48 },
        }),
      })
    })

    await page.goto("/lab")
    await expect(page.getByRole("heading", { name: /prompt lab/i })).toBeVisible()

    const textarea = page.getByRole("textbox").first()
    await textarea.fill(
      "<context>You are a tutor.</context><task>Explain tokens in one sentence.</task>",
    )

    const submit = page.getByRole("button", { name: /send|submit|run/i }).first()
    await submit.click()

    await expect(page.getByText(/hello from claude/i)).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText(/60 tokens|48|12/i).first()).toBeVisible()
  })

  test("surfaces a rate-limit error without crashing", async ({ page }) => {
    await page.route("**/api/prompt", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "Rate limit reached" }),
      })
    })

    await page.goto("/lab")
    const textarea = page.getByRole("textbox").first()
    await textarea.fill("Explain in one sentence")
    const submit = page.getByRole("button", { name: /send|submit|run/i }).first()
    await submit.click()

    await expect(page.getByText(/rate limit/i)).toBeVisible()
  })
})
