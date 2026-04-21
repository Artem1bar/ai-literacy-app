import { ExternalLink, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ScoreMetric } from "@/data/types"
import { cn } from "@/lib/utils"

interface ScoreCardMetricProps {
  label: string
  metric: ScoreMetric
  /** Format for the number. Defaults to percent. */
  unit?: "percent" | "dollars"
  /** Secondary rendering — an absolute dollar equivalent for the wage premium. */
  secondaryLabel?: string
  secondaryValue?: string
  /** Colour semantics: does rising imply good or bad? */
  direction?: "neutral" | "opportunity" | "risk"
  className?: string
}

const CONFIDENCE_STYLES = {
  high: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  low: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
} as const

const CONFIDENCE_LABELS = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
} as const

export function ScoreCardMetric({
  label,
  metric,
  unit = "percent",
  secondaryLabel,
  secondaryValue,
  direction = "neutral",
  className,
}: ScoreCardMetricProps) {
  const barPct = Math.min(100, Math.max(0, metric.value))
  const barClass =
    direction === "risk"
      ? "bg-rose-500"
      : direction === "opportunity"
        ? "bg-emerald-500"
        : "bg-primary"

  const formatted =
    unit === "dollars"
      ? `$${Math.round(metric.value).toLocaleString("en-US")}`
      : `${metric.value.toFixed(1)}%`

  return (
    <div className={cn("rounded-lg border border-border p-4", className)}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium">{label}</h4>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger
              aria-label={`Source and confidence for ${label}`}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                CONFIDENCE_STYLES[metric.confidence],
              )}
            >
              <Info className="h-3 w-3" />
              {CONFIDENCE_LABELS[metric.confidence]}
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              <p className="font-medium">{metric.source.label}</p>
              <p className="mt-1 opacity-80">as of {metric.source.asOf}</p>
              {metric.note && <p className="mt-1 opacity-80">{metric.note}</p>}
              {metric.source.url && (
                <a
                  href={metric.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 underline"
                >
                  View source <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums">{formatted}</span>
        {secondaryValue && (
          <span className="text-xs text-muted-foreground">
            ≈ <span className="font-medium">{secondaryValue}</span>
            {secondaryLabel ? ` ${secondaryLabel}` : ""}
          </span>
        )}
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all", barClass)}
          style={{ width: `${barPct}%` }}
          aria-hidden
        />
      </div>
    </div>
  )
}
