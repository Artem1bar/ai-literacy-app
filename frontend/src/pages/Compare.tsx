import { Link, useParams } from "react-router"
import { ArrowLeftRight } from "lucide-react"
import { useOccupation } from "@/hooks/useOccupation"
import { ScoreCardCompare } from "@/components/score-card/ScoreCardCompare"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Compare() {
  const { socA, socB } = useParams<{ socA: string; socB: string }>()
  const a = useOccupation(socA ?? null)
  const b = useOccupation(socB ?? null)

  if (!socA || !socB) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        Missing SOC code. Try <Link to="/occupations">Occupations</Link>.
      </div>
    )
  }

  if (a.isLoading || b.isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-10">Loading…</div>
  }

  if (a.isError || b.isError || !a.data || !b.data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">Couldn't load one or both occupations</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Make sure both SOC codes exist in the corpus.
            </p>
            <Button variant="outline" asChild>
              <Link to="/occupations">Browse all</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <ArrowLeftRight className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold">Compare</h1>
      </div>
      <p className="mb-8 text-sm text-muted-foreground">
        <Link
          to={`/occupations/${encodeURIComponent(a.data.code)}`}
          className="font-medium hover:text-foreground"
        >
          {a.data.title}
        </Link>{" "}
        versus{" "}
        <Link
          to={`/occupations/${encodeURIComponent(b.data.code)}`}
          className="font-medium hover:text-foreground"
        >
          {b.data.title}
        </Link>
      </p>

      <ScoreCardCompare a={a.data} b={b.data} />
    </div>
  )
}
