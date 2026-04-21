import { Link } from "react-router"
import { Clock, CheckCircle2, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MODULES } from "@/data/modules"
import type { LearningPath } from "@/data/types"

interface LearningPathListProps {
  path: LearningPath
}

export function LearningPathList({ path }: LearningPathListProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>
          Estimated total: <strong>{path.estimatedTotalMinutes} min</strong>
        </span>
        <span>·</span>
        <span>{path.recommendedModules.length} modules</span>
      </div>

      <ol className="space-y-3">
        {path.recommendedModules.map((ref, i) => {
          const module = MODULES.find((m) => m.id === ref.moduleId)
          return (
            <li key={`${ref.moduleId}-${ref.order}`}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div>
                          {module ? (
                            <Link
                              to={`/learn/${module.slug}`}
                              className="font-semibold hover:text-primary"
                            >
                              {module.title}
                            </Link>
                          ) : (
                            <span className="font-semibold text-destructive">
                              Missing module: {ref.moduleId}
                            </span>
                          )}
                        </div>
                        {module && (
                          <span className="text-xs text-muted-foreground">
                            ~{module.estimatedMinutes} min
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {ref.rationale}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {ref.covers.map((cov) => (
                          <Badge key={cov} variant="secondary" className="text-[10px]">
                            {cov}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="mt-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ol>

      {path.milestones.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold">Milestones</h3>
          <ul className="space-y-2 text-sm">
            {path.milestones.map((m) => (
              <li key={m.id} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <div>
                  <span className="font-medium">{m.label}</span>
                  <span className="ml-1 text-muted-foreground">— {m.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
