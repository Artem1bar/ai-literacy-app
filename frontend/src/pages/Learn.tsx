import { useState } from "react"
import { BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModuleCard } from "@/components/learn/ModuleCard"
import { RecommendedPath } from "@/components/learn/RecommendedPath"
import { MODULES } from "@/data/modules"
import { USER_ROLES } from "@/data/user-roles"
import { useProfile } from "@/hooks/useProfile"
import { useCurriculum } from "@/hooks/useOccupation"
import type { UserRole } from "@/data/types"

export default function Learn() {
  const { profile } = useProfile()
  const curriculum = useCurriculum(profile.socCode)
  const [filter, setFilter] = useState<UserRole | "all">(profile.role ?? "all")

  const filtered =
    filter === "all"
      ? MODULES
      : MODULES.filter((m) => m.roles.includes(filter))

  // When the user has a SOC, reorder modules so recommended-path ones come first.
  const recommendedIds = new Set(
    curriculum.data?.recommendedModules.map((m) => m.moduleId) ?? [],
  )
  const sorted = recommendedIds.size > 0
    ? [...filtered].sort((a, b) => {
        const aRec = recommendedIds.has(a.id)
        const bRec = recommendedIds.has(b.id)
        if (aRec && !bRec) return -1
        if (!aRec && bRec) return 1
        return 0
      })
    : filtered

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Learn</h1>
        </div>
        <p className="text-muted-foreground">
          Five research-backed modules covering AI fundamentals, prompt engineering,
          Claude workflows, responsible use, and role-specific skills.
        </p>
      </div>

      <div className="mb-6">
        <RecommendedPath />
      </div>

      {/* Role filter */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as UserRole | "all")}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {USER_ROLES.map((r) => (
            <TabsTrigger key={r.id} value={r.id}>
              {r.label.split(" /")[0]}
              {profile.role === r.id && (
                <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                  you
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {recommendedIds.size > 0 && (
        <p className="mb-4 text-xs text-muted-foreground">
          <Badge variant="outline" className="mr-1 border-primary/40 text-primary">
            Recommended
          </Badge>{" "}
          modules are ordered first based on your occupation's learning path.
        </p>
      )}

      {/* Module grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((module) => (
          <div key={module.id} className="relative">
            {recommendedIds.has(module.id) && (
              <Badge
                variant="outline"
                className="absolute -top-2 right-3 z-10 border-primary bg-background text-xs text-primary"
              >
                Recommended
              </Badge>
            )}
            <ModuleCard module={module} />
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No modules found for this filter.
        </p>
      )}
    </div>
  )
}
