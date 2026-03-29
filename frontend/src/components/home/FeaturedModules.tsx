import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModuleCard } from "@/components/learn/ModuleCard"
import { MODULES } from "@/data/modules"
import { useRole } from "@/hooks/useRole"
import { ROUTES } from "@/lib/constants"

export function FeaturedModules() {
  const { role } = useRole()

  const featured = role
    ? MODULES.filter((m) => m.roles.includes(role)).slice(0, 3)
    : MODULES.slice(0, 3)

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              {role ? "Your Learning Path" : "Featured Modules"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {role
                ? `Modules tailored for ${role === "student" ? "students" : role === "professor" ? "educators" : "developers"}`
                : "Start with the fundamentals"}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 hidden sm:flex">
            <Link to={ROUTES.LEARN}>
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button asChild variant="outline" size="sm">
            <Link to={ROUTES.LEARN}>View all modules</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
