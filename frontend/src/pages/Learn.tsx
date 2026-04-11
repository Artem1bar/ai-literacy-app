import { useState } from "react"
import { motion } from "framer-motion"
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
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      {/* Header — matches // comment label system */}
      <div className="mb-8">
        <p className="label-comment text-primary/75 mb-3">// the curriculum</p>
        <h1 className="text-3xl font-bold tracking-tight">Learn</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Thirty modules on the parts of AI that actually matter day to day:
          fundamentals, prompt engineering, Claude workflows, responsible use,
          and the advanced techniques that separate fluent users from casual ones.
          Filter by role to surface what's most relevant to you.
        </p>
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
              {role === r.id && (
                <Badge variant="secondary" className="ml-1.5 h-4 text-[10px] px-1">
                  you
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Module grid — stagger on filter change only */}
      <motion.div
        key={filter}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {filtered.map((module, i) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <ModuleCard module={module} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="label-comment text-center py-12">
          no modules match this filter
        </p>
      )}
    </div>
  )
}
