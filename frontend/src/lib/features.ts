import { BACKEND_ENABLED, ROUTES } from "./constants"
import { USER_ROLES } from "@/data/user-roles"
import type { UserRole } from "@/data/types"

/**
 * Surfaces that need the FastAPI backend: the Prompt Lab, the Louisiana
 * occupation explorer, and everything whose only purpose is to feed it
 * (assessment, compare, megaprojects, the onboarding wizard).
 */
const BACKEND_ROUTE_PATHS: readonly string[] = [
  ROUTES.LAB,
  ROUTES.OCCUPATIONS,
  ROUTES.OCCUPATION_DETAIL,
  ROUTES.COMPARE,
  ROUTES.ASSESSMENT,
  ROUTES.MEGAPROJECTS,
  ROUTES.ONBOARDING,
  `${ROUTES.ONBOARDING}/:step`,
]

/** Route patterns (as declared in the router) that only exist with a backend. */
export function requiresBackend(routePath: string): boolean {
  return BACKEND_ROUTE_PATHS.includes(routePath)
}

export interface NavLink {
  label: string
  href: string
}

const ALL_NAV_LINKS: readonly (NavLink & { backend?: boolean })[] = [
  { label: "Learn", href: ROUTES.LEARN },
  { label: "Occupations", href: ROUTES.OCCUPATIONS, backend: true },
  { label: "Megaprojects", href: ROUTES.MEGAPROJECTS, backend: true },
  { label: "Prompt Lab", href: ROUTES.LAB, backend: true },
  { label: "Glossary", href: ROUTES.GLOSSARY },
  { label: "Resources", href: ROUTES.RESOURCES },
  { label: "Profile", href: ROUTES.PROFILE },
]

/** Top-level navigation for a build; backend-only entries drop out without one. */
export function navLinks(backendEnabled: boolean = BACKEND_ENABLED): NavLink[] {
  return ALL_NAV_LINKS.filter((link) => backendEnabled || !link.backend).map(
    ({ label, href }) => ({ label, href }),
  )
}

/** The "Louisiana Worker" role promises SOC score cards, so it needs the backend too. */
const BACKEND_ONLY_ROLES: readonly UserRole[] = ["worker"]

export function availableRoles(backendEnabled: boolean = BACKEND_ENABLED) {
  return USER_ROLES.filter((role) => backendEnabled || !BACKEND_ONLY_ROLES.includes(role.id))
}
