import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router"
import { RootLayout } from "@/components/layout/RootLayout"
import { ErrorBoundary } from "@/components/ErrorBoundary"

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

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/learn" element={<Page><Learn /></Page>} />
        <Route path="/learn/:slug" element={<Page><Module /></Page>} />
        <Route path="/lab" element={<Page><Lab /></Page>} />
        <Route path="/resources" element={<Page><Resources /></Page>} />
        <Route path="/profile" element={<Page><Profile /></Page>} />
        <Route path="/occupations" element={<Page><Occupations /></Page>} />
        <Route path="/occupations/:code" element={<Page><OccupationDetail /></Page>} />
        <Route path="/onboarding" element={<Page><Onboarding /></Page>} />
        <Route path="/onboarding/:step" element={<Page><Onboarding /></Page>} />
        <Route path="/compare/:socA/:socB" element={<Page><Compare /></Page>} />
        <Route path="/glossary" element={<Page><Glossary /></Page>} />
        <Route path="/megaprojects" element={<Page><Megaprojects /></Page>} />
        <Route path="/assessment" element={<Page><Assessment /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Route>
    </Routes>
  )
}
