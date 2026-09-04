import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router"
import { RootLayout } from "@/components/layout/RootLayout"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { BACKEND_ENABLED, ROUTES } from "@/lib/constants"
import { requiresBackend } from "@/lib/features"

const Home = lazy(() => import("@/pages/Home"))
const Learn = lazy(() => import("@/pages/Learn"))
const Module = lazy(() => import("@/pages/Module"))
const Lab = lazy(() => import("@/pages/Lab"))
const Resources = lazy(() => import("@/pages/Resources"))
const Profile = lazy(() => import("@/pages/Profile"))
const Occupations = lazy(() => import("@/pages/Occupations"))
const OccupationDetail = lazy(() => import("@/pages/OccupationDetail"))
const Onboarding = lazy(() => import("@/pages/Onboarding"))
const Compare = lazy(() => import("@/pages/Compare"))
const Glossary = lazy(() => import("@/pages/Glossary"))
const Megaprojects = lazy(() => import("@/pages/Megaprojects"))
const Assessment = lazy(() => import("@/pages/Assessment"))
const NotFound = lazy(() => import("@/pages/NotFound"))

function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-live="polite">
      <div className="animate-pulse space-y-6">
        <div className="space-y-3">
          <div className="h-8 w-48 rounded-md bg-muted/70" />
          <div className="h-4 w-full max-w-2xl rounded-md bg-muted/50" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-40 rounded-xl border border-border bg-card/40" />
          <div className="h-40 rounded-xl border border-border bg-card/40" />
          <div className="h-40 rounded-xl border border-border bg-card/40" />
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

const ROUTE_TABLE: { path: string; element: React.ReactNode }[] = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.LEARN, element: <Learn /> },
  { path: ROUTES.MODULE, element: <Module /> },
  { path: ROUTES.LAB, element: <Lab /> },
  { path: ROUTES.RESOURCES, element: <Resources /> },
  { path: ROUTES.PROFILE, element: <Profile /> },
  { path: ROUTES.OCCUPATIONS, element: <Occupations /> },
  { path: ROUTES.OCCUPATION_DETAIL, element: <OccupationDetail /> },
  { path: ROUTES.ONBOARDING, element: <Onboarding /> },
  { path: `${ROUTES.ONBOARDING}/:step`, element: <Onboarding /> },
  { path: ROUTES.COMPARE, element: <Compare /> },
  { path: ROUTES.GLOSSARY, element: <Glossary /> },
  { path: ROUTES.MEGAPROJECTS, element: <Megaprojects /> },
  { path: ROUTES.ASSESSMENT, element: <Assessment /> },
  { path: "*", element: <NotFound /> },
]

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {ROUTE_TABLE.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              // Static build: backend-only surfaces send the visitor to the modules index.
              !BACKEND_ENABLED && requiresBackend(path) ? (
                <Navigate to={ROUTES.LEARN} replace />
              ) : (
                <Page>{element}</Page>
              )
            }
          />
        ))}
      </Route>
    </Routes>
  )
}
