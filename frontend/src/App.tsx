import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router"
import { RootLayout } from "@/components/layout/RootLayout"

const Home = lazy(() => import("@/pages/Home"))
const Learn = lazy(() => import("@/pages/Learn"))
const Module = lazy(() => import("@/pages/Module"))
const Lab = lazy(() => import("@/pages/Lab"))
const Resources = lazy(() => import("@/pages/Resources"))
const Profile = lazy(() => import("@/pages/Profile"))

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/learn"
          element={
            <Suspense fallback={<Loading />}>
              <Learn />
            </Suspense>
          }
        />
        <Route
          path="/learn/:slug"
          element={
            <Suspense fallback={<Loading />}>
              <Module />
            </Suspense>
          }
        />
        <Route
          path="/lab"
          element={
            <Suspense fallback={<Loading />}>
              <Lab />
            </Suspense>
          }
        />
        <Route
          path="/resources"
          element={
            <Suspense fallback={<Loading />}>
              <Resources />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
