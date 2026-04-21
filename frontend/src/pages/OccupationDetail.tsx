import { useParams, Link } from "react-router"
import { Briefcase } from "lucide-react"
import { useOccupation } from "@/hooks/useOccupation"
import { useProfile } from "@/hooks/useProfile"
import { ScoreCard } from "@/components/score-card/ScoreCard"
import { SkillBundleTabs } from "@/components/occupations/SkillBundleTabs"
import { LearningPathList } from "@/components/occupations/LearningPathList"
import { CareerLadder } from "@/components/occupations/CareerLadder"
import { ParishContext } from "@/components/occupations/ParishContext"
import { OpenJobs } from "@/components/occupations/OpenJobs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function OccupationDetail() {
  const { code } = useParams<{ code: string }>()
  const query = useOccupation(code ?? null)
  const { profile } = useProfile()

  if (!code) {
    return <div className="mx-auto max-w-5xl px-4 py-10">No occupation code provided.</div>
  }

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="h-4 w-full max-w-xl rounded bg-muted" />
          <div className="h-48 rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-2 font-semibold">Occupation not found</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We don't have a record for SOC <code>{code}</code>. It may be in the
              broader priority list but not yet authored — check back soon.
            </p>
            <Button variant="outline" asChild>
              <Link to="/occupations">Browse all occupations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const occ = query.data

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          <Link to="/occupations" className="hover:text-foreground">
            All Louisiana Occupations
          </Link>
          <span>·</span>
          <span className="font-mono">{occ.code}</span>
        </div>
        <h1 className="text-3xl font-bold">{occ.title}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">{occ.summary}</p>
      </div>

      <div className="mb-10">
        <ScoreCard
          scoreCard={occ.scoreCard}
          medianWage={occ.laMedianWage}
          wagePremiumDollars={occ.derived.wagePremiumDollars}
        />
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Skill bundle</h2>
        <SkillBundleTabs bundle={occ.skillBundle} />
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Recommended learning path</h2>
        <LearningPathList path={occ.learningPath} />
      </div>

      {(profile.parishId || profile.rlma) && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">In your area</h2>
          <ParishContext
            parishId={profile.parishId}
            rlmaId={profile.rlma}
            socCode={occ.code}
          />
        </div>
      )}

      <div className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Open positions</h2>
        <OpenJobs socCode={occ.code} parishId={profile.parishId} />
      </div>

      {occ.relatedSOCs.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Related occupations</h2>
          <CareerLadder currentCode={occ.code} relatedCodes={occ.relatedSOCs} />
        </div>
      )}
    </div>
  )
}
