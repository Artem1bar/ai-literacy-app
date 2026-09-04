import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModuleCard } from "@/components/learn/ModuleCard"
import { RecommendedPath } from "@/components/learn/RecommendedPath"
import { MODULES } from "@/data/modules"
import { useProfile } from "@/hooks/useProfile"
import { useCurriculum } from "@/hooks/useOccupation"
import { BACKEND_ENABLED } from "@/lib/constants"
import { availableRoles } from "@/lib/features"
import type { UserRole } from "@/data/types"

export default function Learn() {
  const { profile } = useProfile()
  const curriculum = useCurriculum(profile.socCode)
  const [filter, setFilter] = useState<UserRole | "all">(profile.role ?? "all")

  const filtered =
    filter === "all" || filter === "worker"
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
      <div className="mb-10">
        <p className="label-comment text-primary mb-3">// the curriculum</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Learn</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Thirty modules on the parts of AI that matter day to day. Filter by role to
          surface what's most relevant.
        </p>
      </div>

      {BACKEND_ENABLED && (
        <div className="mb-6">
          <RecommendedPath />
        </div>
      )}

      {/* Role filter */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as UserRole | "all")}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {availableRoles().map((r) => (
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

      {/* Module grid — stagger on filter change only */}
      <motion.div
        key={filter}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {sorted.map((module, i) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="relative"
          >
            {recommendedIds.has(module.id) && (
              <Badge
                variant="outline"
                className="absolute -top-2 right-3 z-10 border-primary bg-background text-xs text-primary"
              >
                Recommended
              </Badge>
            )}
            <ModuleCard module={module} />
          </motion.div>
        ))}
      </motion.div>

      {sorted.length === 0 && (
        <p className="label-comment text-center py-12">
          no modules match this filter
        </p>
      )}
    </div>
  )
}
