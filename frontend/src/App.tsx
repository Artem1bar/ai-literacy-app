import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router"

const Home = lazy(() => import("@/pages/Home"))
const Learn = lazy(() => import("@/pages/Learn"))
const Module = lazy(() => import("@/pages/Module"))
const Lab = lazy(() => import("@/pages/Lab"))
const Resources = lazy(() => import("@/pages/Resources"))
const Profile = lazy(() => import("@/pages/Profile"))

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:slug" element={<Module />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  )
}
