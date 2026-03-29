import { Link } from "react-router"
import {
  Brain, MessageSquare, Sparkles, Shield, Workflow,
  Clock, ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useProgressStore } from "@/store/progressStore"
import { cn } from "@/lib/utils"
import type { Module } from "@/data/types"

const MODULE_ICONS: Record<string, React.ElementType> = {
  Brain,
  MessageSquare,
  Sparkles,
  Shield,
  Workflow,
}

interface ModuleCardProps {
  module: Module
  compact?: boolean
}

export function ModuleCard({ module, compact = false }: ModuleCardProps) {
  const getModuleProgress = useProgressStore((s) => s.getModuleProgress)
  const progress = getModuleProgress(module.id, module.sections.length)
  const Icon = MODULE_ICONS[module.icon] ?? Brain

  return (
    <Link to={`/learn/${module.slug}`}>
      <Card className={cn(
        "group h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer",
        compact && "border-0 shadow-none hover:shadow-none hover:bg-accent/50",
      )}>
        <CardHeader className={cn("pb-2", compact && "pb-1")}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold leading-tight",
                  compact ? "text-sm" : "text-base",
                )}>
                  {module.title}
                </h3>
                <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{module.estimatedMinutes} min</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-foreground transition-colors" />
          </div>
        </CardHeader>
        {!compact && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {module.description}
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {module.roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs capitalize">
                  {role}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
