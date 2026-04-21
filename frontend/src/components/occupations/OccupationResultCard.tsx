import { TrendingUp, Users, DollarSign, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RLMAS } from "@/data/louisiana"
import type { OccupationSearchHit } from "@/lib/api"
import { cn } from "@/lib/utils"

interface OccupationResultCardProps {
  hit: OccupationSearchHit
  selected?: boolean
  onClick?: () => void
  compact?: boolean
}

const NUMBER_FORMAT = new Intl.NumberFormat("en-US")
const WAGE_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function confidenceBadge(confidence: "low" | "medium" | "high"): string {
  switch (confidence) {
    case "high":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
    case "medium":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400"
    case "low":
      return "bg-rose-500/15 text-rose-700 dark:text-rose-400"
  }
}

export function OccupationResultCard({
  hit,
  selected = false,
  onClick,
  compact = false,
}: OccupationResultCardProps) {
  const topRLMA = hit.topRLMAs[0]
  const rlmaName = topRLMA
    ? RLMAS.find((r) => r.id === topRLMA[0])?.name.replace(" Region", "")
    : null

  return (
    <div
      onClick={onClick}
      className={cn(
        "group rounded-lg border px-4 py-3 transition-colors",
        onClick && "cursor-pointer",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-primary/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium">{hit.title}</span>
            <span className="font-mono text-xs text-muted-foreground">{hit.code}</span>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{hit.jobFamily}</div>
        </div>
        <Badge
          variant="secondary"
          className={cn("gap-1 text-xs", confidenceBadge(hit.exposureConfidence))}
        >
          <TrendingUp className="h-3 w-3" />
          {Math.round(hit.exposure)}% exposure
        </Badge>
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {hit.laEmployment !== null && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {NUMBER_FORMAT.format(hit.laEmployment)} in LA
            </span>
          )}
          {hit.laMedianWage !== null && (
            <span className="inline-flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {WAGE_FORMAT.format(hit.laMedianWage)} median
            </span>
          )}
          {rlmaName && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {rlmaName}
              {topRLMA && (
                <span className="font-medium">
                  &nbsp;· {Math.round(topRLMA[1])}%
                </span>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
