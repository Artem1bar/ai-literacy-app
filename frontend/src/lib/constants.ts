import { isBackendConfigured, resolveApiUrl } from "./api-url"

export const APP_NAME = "AI Literacy"

export const ROUTES = {
  HOME: "/",
  LEARN: "/learn",
  MODULE: "/learn/:slug",
  LAB: "/lab",
  RESOURCES: "/resources",
  PROFILE: "/profile",
  OCCUPATIONS: "/occupations",
  OCCUPATION_DETAIL: "/occupations/:code",
  ONBOARDING: "/onboarding",
  COMPARE: "/compare/:socA/:socB",
  GLOSSARY: "/glossary",
  MEGAPROJECTS: "/megaprojects",
  ASSESSMENT: "/assessment",
} as const

export const API_URL = resolveApiUrl(import.meta.env.VITE_API_URL)

/**
 * True only when `VITE_API_URL` was set at build time. Without it the app is
 * the static course: backend-only surfaces are neither routed nor linked.
 */
export const BACKEND_ENABLED = isBackendConfigured(import.meta.env.VITE_API_URL)
