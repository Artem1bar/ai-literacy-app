import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { ScoreCard } from "./ScoreCard"
import { Card, CardContent } from "@/components/ui/card"
import type { OccupationDetailResponse } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ScoreCardCompareProps {
  a: OccupationDetailResponse
  b: OccupationDetailResponse
}

interface Delta {
  label: string
  valueA: number
  valueB: number
  direction: "opportunity" | "risk" | "neutral"
}

export function ScoreCardCompare({ a, b }: ScoreCardCompareProps) {
  const deltas: Delta[] = [
    {
      label: "Exposure",
      valueA: a.scoreCard.exposure.value,
      valueB: b.scoreCard.exposure.value,
      direction: "neutral",
    },
    {
      label: "Augmentation",
      valueA: a.scoreCard.augmentation.value,
      valueB: b.scoreCard.augmentation.value,
      direction: "opportunity",
    },
    {
      label: "Replacement",
      valueA: a.scoreCard.replacement.value,
      valueB: b.scoreCard.replacement.value,
      direction: "risk",
    },
    {
      label: "Wage premium",
      valueA: a.scoreCard.wagePremium.value,
      valueB: b.scoreCard.wagePremium.value,
      direction: "opportunity",
    },
  ]

  const aIsRelatedToB = a.relatedSOCs.includes(b.code) || b.relatedSOCs.includes(a.code)

  return (
    <div className="space-y-6">
      {aIsRelatedToB && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-4 text-sm">
            <span className="font-medium">Career-ladder neighbours.</span> These two
            occupations share a career path — many workers move between them.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">{a.title}</h3>
          <p className="mb-3 font-mono text-xs text-muted-foreground">{a.code}</p>
          <ScoreCard
            scoreCard={a.scoreCard}
            medianWage={a.laMedianWage}
            wagePremiumDollars={a.derived.wagePremiumDollars}
          />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">{b.title}</h3>
          <p className="mb-3 font-mono text-xs text-muted-foreground">{b.code}</p>
          <ScoreCard
            scoreCard={b.scoreCard}
            medianWage={b.laMedianWage}
            wagePremiumDollars={b.derived.wagePremiumDollars}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Deltas — B relative to A</h3>
          <dl className="space-y-3">
            {deltas.map((d) => (
              <DeltaRow key={d.label} delta={d} />
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

function DeltaRow({ delta }: { delta: Delta }) {
  const diff = delta.valueB - delta.valueA
  const abs = Math.abs(diff)
  const Icon = diff > 0.5 ? ArrowUp : diff < -0.5 ? ArrowDown : Minus
  const meaning = interpret(delta.direction, diff)
  const color = meaning === "better" ? "text-emerald-500" : meaning === "worse" ? "text-rose-500" : "text-muted-foreground"
  return (
    <div className="grid grid-cols-[120px_1fr_80px] items-baseline gap-3 text-sm">
      <dt className="text-muted-foreground">{delta.label}</dt>
      <dd className="font-medium">
        <span className="text-muted-foreground">{delta.valueA.toFixed(1)}%</span>
        <span className="mx-2 text-muted-foreground">→</span>
        <span>{delta.valueB.toFixed(1)}%</span>
      </dd>
      <dd className={cn("flex items-center justify-end gap-1 text-xs", color)}>
        <Icon className="h-3 w-3" />
        <span>{abs.toFixed(1)} pts</span>
      </dd>
    </div>
  )
}

function interpret(direction: Delta["direction"], diff: number): "better" | "worse" | "neutral" {
  if (Math.abs(diff) < 0.5) return "neutral"
  if (direction === "opportunity") return diff > 0 ? "better" : "worse"
  if (direction === "risk") return diff > 0 ? "worse" : "better"
  return "neutral"
}
