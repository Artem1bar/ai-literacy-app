/**
 * Backend wiring is decided at build time from `VITE_API_URL`.
 *
 * - Unset: the build is the static course. No request is ever made and the
 *   backend-only surfaces (Prompt Lab, occupation explorer) are not offered.
 *   This is what the Vercel deployment does.
 * - Set: the backend is reachable at that URL. "" or "/" means same origin.
 *   Trailing slashes are dropped so paths can be appended.
 *
 * No localhost literal lives in the bundle: local development sets the URL
 * in `frontend/.env.local` (see `.env.example`).
 */
export function isBackendConfigured(configured: string | undefined): boolean {
  return typeof configured === "string"
}

export function resolveApiUrl(configured: string | undefined): string {
  if (!isBackendConfigured(configured)) return ""
  return configured!.trim().replace(/\/+$/, "")
}
