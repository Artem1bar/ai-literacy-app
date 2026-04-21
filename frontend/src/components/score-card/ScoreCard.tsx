import { Link } from "react-router"
import { ScoreCardMetric } from "./ScoreCardMetric"
import type { SOCScoreCard } from "@/data/types"

interface ScoreCardProps {
  scoreCard: SOCScoreCard
  medianWage?: number | null
  wagePremiumDollars?: number | null
}

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function ScoreCard({
  scoreCard,
  medianWage,
  wagePremiumDollars,
}: ScoreCardProps) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCardMetric label="AI exposure" metric={scoreCard.exposure} direction="neutral" />
        <ScoreCardMetric
          label="Augmentation"
          metric={scoreCard.augmentation}
          direction="opportunity"
        />
        <ScoreCardMetric
          label="Replacement / automation"
          metric={scoreCard.replacement}
          direction="risk"
        />
        <ScoreCardMetric
          label="Wage premium"
          metric={scoreCard.wagePremium}
          direction="opportunity"
          secondaryLabel={wagePremiumDollars !== null && wagePremiumDollars !== undefined ? "over LA median" : undefined}
          secondaryValue={
            wagePremiumDollars !== null && wagePremiumDollars !== undefined
              ? USD.format(wagePremiumDollars)
              : undefined
          }
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Every score carries a confidence qualifier.{" "}
        <Link to="/glossary#ai-exposure" className="underline hover:text-foreground">
          Learn how these are computed
        </Link>
        {medianWage && (
          <>
            {" "}
            · LA median wage for this occupation: <span className="font-medium">{USD.format(medianWage)}</span>
          </>
        )}
        .
      </p>
    </div>
  )
}
