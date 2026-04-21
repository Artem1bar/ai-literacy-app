import { Link } from "react-router"
import { ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useOccupations } from "@/hooks/useOccupation"

interface CareerLadderProps {
  currentCode: string
  relatedCodes: readonly string[]
}

export function CareerLadder({ currentCode, relatedCodes }: CareerLadderProps) {
  const all = useOccupations(false)
  if (!all.data) return null

  const related = relatedCodes
    .map((code) => all.data!.results.find((o) => o.code === code))
    .filter((o): o is NonNullable<typeof o> => o !== undefined)

  if (related.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {related.map((occ) => {
        const delta = deltaDescriptor(occ, all.data!.results.find((o) => o.code === currentCode))
        return (
          <Link key={occ.code} to={`/compare/${currentCode}/${occ.code}`} aria-label={`Compare ${currentCode} to ${occ.code}`}>
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/40">
              <CardContent className="p-4">
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <span className="font-medium">{occ.title}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="mb-3 font-mono text-xs text-muted-foreground">{occ.code}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="outline" className="gap-1">
                    Exposure {Math.round(occ.exposure)}%
                  </Badge>
                  {delta && (
                    <span className="text-muted-foreground">{delta}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

function deltaDescriptor(
  target: { exposure: number; wagePremium: number },
  current: { exposure: number; wagePremium: number } | undefined,
): string | null {
  if (!current) return null
  const expDelta = target.exposure - current.exposure
  const wageDelta = target.wagePremium - current.wagePremium
  const parts: string[] = []
  if (Math.abs(expDelta) >= 5) {
    parts.push(`${expDelta > 0 ? "+" : ""}${expDelta.toFixed(0)} exposure`)
  }
  if (Math.abs(wageDelta) >= 5) {
    parts.push(`${wageDelta > 0 ? "+" : ""}${wageDelta.toFixed(0)} premium`)
  }
  return parts.length > 0 ? parts.join(" · ") : null
}
