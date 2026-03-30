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
const NotFound = lazy(() => import("@/pages/NotFound"))

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
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
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Route>
    </Routes>
  )
}
