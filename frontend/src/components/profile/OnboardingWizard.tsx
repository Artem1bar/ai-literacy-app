import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, ArrowRight, Check, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { USER_ROLES } from "@/data/user-roles"
import { useProfile } from "@/hooks/useProfile"
import { OccupationSearch } from "@/components/occupations/OccupationSearch"
import { OccupationResultCard } from "@/components/occupations/OccupationResultCard"
import { ParishPicker } from "@/components/profile/ParishPicker"
import { SectorPicker } from "@/components/profile/SectorPicker"
import { EmployerPicker } from "@/components/profile/EmployerPicker"
import type { UserRole } from "@/data/types"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: "role", label: "Role" },
  { id: "occupation", label: "Occupation" },
  { id: "parish", label: "Parish" },
  { id: "sector", label: "Sector" },
  { id: "employer", label: "Employer" },
  { id: "review", label: "Review" },
] as const

type StepId = (typeof STEPS)[number]["id"]

function stepIndex(id: StepId | undefined): number {
  if (!id) return 0
  return Math.max(
    0,
    STEPS.findIndex((s) => s.id === id),
  )
}

export function OnboardingWizard() {
  const navigate = useNavigate()
  const { step: stepParam } = useParams<{ step?: string }>()
  const idx = stepIndex(stepParam as StepId | undefined)
  const step = STEPS[idx]!

  const {
    profile,
    setRole,
    setSOC,
    setParish,
    setSector,
    setEmployer,
  } = useProfile()

  const [justSelectedSOC, setJustSelectedSOC] = useState<string | null>(null)

  useEffect(() => {
    // Normalise unknown step strings to role.
    if (stepParam && !STEPS.find((s) => s.id === stepParam)) {
      navigate("/onboarding/role", { replace: true })
    }
  }, [stepParam, navigate])

  const progress = useMemo(() => ((idx + 1) / STEPS.length) * 100, [idx])

  const goPrev = () => {
    if (idx > 0) navigate(`/onboarding/${STEPS[idx - 1]!.id}`)
  }

  const goNext = () => {
    if (idx < STEPS.length - 1) navigate(`/onboarding/${STEPS[idx + 1]!.id}`)
    else navigate("/profile")
  }

  const skip = goNext

  const stepComplete = (() => {
    switch (step.id) {
      case "role":
        return profile.role !== null
      case "occupation":
        return profile.socCode !== null
      case "parish":
        return profile.parishId !== null
      case "sector":
        return profile.sectorId !== null
      case "employer":
        return profile.currentEmployerId !== null
      case "review":
        return true
    }
  })()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Step {idx + 1} of {STEPS.length}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <h1 className="text-3xl font-bold">{stepLabel(step.id)}</h1>
          <span className="text-sm text-muted-foreground">{stepSubtitle(step.id)}</span>
        </div>
        <Progress value={progress} className="mt-3" />
      </div>

      <Card>
        <CardContent className="p-6">
          {step.id === "role" && <RoleStep value={profile.role} onChange={setRole} />}

          {step.id === "occupation" && (
            <div>
              <p className="mb-4 text-sm text-muted-foreground">
                Search by job title or SOC code. Pick the occupation that best matches
                your current or target role. You can change this later.
              </p>
              {profile.socCode && (
                <div className="mb-4 rounded-md bg-primary/5 px-3 py-2 text-sm">
                  Currently selected:{" "}
                  <span className="font-mono">{profile.socCode}</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-2 h-auto p-0"
                    onClick={() => setSOC(null)}
                  >
                    Clear
                  </Button>
                </div>
              )}
              <OccupationSearch
                initialQuery=""
                autoFocus
                onSelect={(hit) => {
                  setSOC(hit.code)
                  setJustSelectedSOC(hit.code)
                }}
                renderHit={(hit, selected) => (
                  <OccupationResultCard
                    hit={hit}
                    selected={selected || hit.code === justSelectedSOC}
                  />
                )}
              />
              {justSelectedSOC && (
                <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">
                  <Check className="mr-1 inline h-4 w-4" />
                  Selected {justSelectedSOC}. Continue to the next step.
                </div>
              )}
            </div>
          )}

          {step.id === "parish" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your parish tells us which Regional Labor Market Area you're in, so we
                can surface the local employers and megaprojects that matter.
              </p>
              <ParishPicker value={profile.parishId} onChange={setParish} />
              {profile.rlma && (
                <p className="text-xs text-muted-foreground">
                  Region: <span className="font-medium">{profile.rlma}</span>
                </p>
              )}
            </div>
          )}

          {step.id === "sector" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Optional — pick the industry you're in so we can bias recommendations.
              </p>
              <SectorPicker value={profile.sectorId} onChange={setSector} />
            </div>
          )}

          {step.id === "employer" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Optional — picking your employer unlocks employer-specific content when
                available. Parish and sector filters are applied.
              </p>
              <EmployerPicker
                value={profile.currentEmployerId}
                onChange={setEmployer}
                parishId={profile.parishId}
                sectorId={profile.sectorId}
              />
            </div>
          )}

          {step.id === "review" && (
            <ReviewStep
              summary={{
                role: profile.role,
                socCode: profile.socCode,
                parishId: profile.parishId,
                sectorId: profile.sectorId,
                currentEmployerId: profile.currentEmployerId,
                rlma: profile.rlma,
              }}
            />
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={goPrev} disabled={idx === 0} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          {step.id !== "role" && step.id !== "review" && (
            <Button variant="ghost" onClick={skip} className="gap-1 text-muted-foreground">
              <SkipForward className="h-3.5 w-3.5" /> Skip
            </Button>
          )}
          <Button onClick={goNext} className="gap-1" disabled={step.id === "role" && !stepComplete}>
            {idx === STEPS.length - 1 ? "Go to profile" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ───────────── Sub-components ─────────────

function RoleStep({
  value,
  onChange,
}: {
  value: UserRole | null
  onChange: (r: UserRole) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {USER_ROLES.map((r) => {
        const selected = value === r.id
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            aria-pressed={selected}
            className={cn(
              "rounded-lg border px-4 py-3 text-left transition-all",
              selected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40",
            )}
          >
            <div className="mb-1 font-semibold">{r.label}</div>
            <p className="text-xs text-muted-foreground">{r.description}</p>
          </button>
        )
      })}
    </div>
  )
}

function ReviewStep({
  summary,
}: {
  summary: {
    role: UserRole | null
    socCode: string | null
    parishId: string | null
    sectorId: string | null
    currentEmployerId: string | null
    rlma: string | null
  }
}) {
  const rows = [
    { label: "Role", value: summary.role ?? "(skipped)" },
    { label: "Occupation (SOC)", value: summary.socCode ?? "(skipped)" },
    { label: "Parish", value: summary.parishId ?? "(skipped)" },
    { label: "RLMA", value: summary.rlma ?? "(derived from parish)" },
    { label: "Sector", value: summary.sectorId ?? "(skipped)" },
    { label: "Employer", value: summary.currentEmployerId ?? "(skipped)" },
  ]
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        Your profile is saved locally — nothing leaves your browser. Edit any field
        later from the Profile page.
      </p>
      <dl className="divide-y divide-border rounded-md border border-border">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-[120px_1fr] items-baseline gap-2 px-4 py-2.5 text-sm"
          >
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function stepLabel(id: StepId): string {
  switch (id) {
    case "role":
      return "Choose your role"
    case "occupation":
      return "Find your occupation"
    case "parish":
      return "Where in Louisiana?"
    case "sector":
      return "Your industry sector"
    case "employer":
      return "Your employer"
    case "review":
      return "Review & continue"
  }
}

function stepSubtitle(id: StepId): string {
  switch (id) {
    case "role":
      return "required"
    case "occupation":
      return "strongly recommended"
    case "parish":
      return "optional"
    case "sector":
      return "optional"
    case "employer":
      return "optional"
    case "review":
      return ""
  }
}
