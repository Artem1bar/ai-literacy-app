import { Link } from "react-router"
import { Sparkles, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCurriculum, useOccupation } from "@/hooks/useOccupation"
import { MODULES } from "@/data/modules"
import { useProfile } from "@/hooks/useProfile"
import { cn } from "@/lib/utils"

export function RecommendedPath() {
  const { profile } = useProfile()
  const occupation = useOccupation(profile.socCode)
  const curriculum = useCurriculum(profile.socCode)

  if (!profile.socCode) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Personalize your path</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Pick your Louisiana SOC to get a learning path tailored to your
              occupation — or take a 5-question assessment if you're not sure.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="default" size="sm">
              <Link to="/assessment">Start assessment</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/occupations">Browse SOCs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (curriculum.isLoading || occupation.isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Loading your personalized path…
        </CardContent>
      </Card>
    )
  }

  if (!curriculum.data || !occupation.data) return null

  const path = curriculum.data
  const pathModules = path.recommendedModules
    .map((ref) => ({
      ref,
      module: MODULES.find((m) => m.id === ref.moduleId),
    }))
    .filter((p): p is { ref: typeof p.ref; module: NonNullable<typeof p.module> } =>
      Boolean(p.module),
    )

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-5">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Recommended for your role</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on your occupation — {" "}
              <Link
                to={`/occupations/${encodeURIComponent(occupation.data.code)}`}
                className="font-medium text-foreground hover:underline"
              >
                {occupation.data.title}
              </Link>
              .
            </p>
          </div>
          <Badge variant="secondary" className="whitespace-nowrap text-xs">
            {path.estimatedTotalMinutes} min total
          </Badge>
        </div>
        <ol className="space-y-2">
          {pathModules.map(({ ref, module }, i) => (
            <li key={module.id}>
              <Link
                to={`/learn/${module.slug}`}
                className={cn(
                  "flex items-center gap-3 rounded-md border border-transparent px-3 py-2 transition-colors",
                  "hover:border-primary/40 hover:bg-background",
                )}
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{module.title}</div>
                  <div className="text-xs text-muted-foreground">{ref.rationale}</div>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
