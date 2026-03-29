import { useState } from "react"
import { BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModuleCard } from "@/components/learn/ModuleCard"
import { MODULES } from "@/data/modules"
import { USER_ROLES } from "@/data/user-roles"
import { useRole } from "@/hooks/useRole"
import type { UserRole } from "@/data/types"

export default function Learn() {
  const { role } = useRole()
  const [filter, setFilter] = useState<UserRole | "all">(role ?? "all")

  const filtered =
    filter === "all"
      ? MODULES
      : MODULES.filter((m) => m.roles.includes(filter))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Learn</h1>
        </div>
        <p className="text-muted-foreground">
          Five research-backed modules covering AI fundamentals, prompt engineering,
          Claude workflows, responsible use, and role-specific skills.
        </p>
      </div>

      {/* Role filter */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as UserRole | "all")} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {USER_ROLES.map((r) => (
            <TabsTrigger key={r.id} value={r.id}>
              {r.label.split(" /")[0]}
              {role === r.id && (
                <Badge variant="secondary" className="ml-1.5 h-4 text-[10px] px-1">
                  you
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Module grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No modules found for this filter.
        </p>
      )}
    </div>
  )
}
