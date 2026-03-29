import { cn } from "@/lib/utils"
import type { PromptScore } from "@/hooks/usePromptLab"

interface PromptScorerProps {
  score: PromptScore | null
}

function scoreColor(pct: number) {
  if (pct >= 70) return "text-green-500"
  if (pct >= 40) return "text-yellow-500"
  return "text-red-500"
}

function barColor(pct: number) {
  if (pct >= 70) return "bg-green-500"
  if (pct >= 40) return "bg-yellow-500"
  return "bg-red-500"
}

export function PromptScorer({ score }: PromptScorerProps) {
  if (!score) return null

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Prompt Score
        </p>
        <span className={cn("text-xl font-bold tabular-nums", scoreColor(score.total))}>
          {score.total}
          <span className="text-xs font-normal text-muted-foreground">/100</span>
        </span>
      </div>

      <div className="space-y-2">
        {score.breakdown.map((item) => {
          const pct = Math.round((item.score / item.max) * 100)
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={cn("font-medium tabular-nums", scoreColor(pct))}>
                  {item.score}/{item.max}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", barColor(pct))}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{item.note}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
