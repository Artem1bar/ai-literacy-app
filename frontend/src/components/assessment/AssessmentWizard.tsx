import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router"
import { ClipboardCheck, ArrowRight, RefreshCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ASSESSMENT_QUESTIONS,
  suggestSOCs,
  type AssessmentAnswerMap,
} from "@/data/assessment"
import { useProfile } from "@/hooks/useProfile"
import { cn } from "@/lib/utils"

export function AssessmentWizard() {
  const navigate = useNavigate()
  const { setSOC, setAssessmentResult } = useProfile()
  const [answers, setAnswers] = useState<AssessmentAnswerMap>({})
  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)

  const total = ASSESSMENT_QUESTIONS.length
  const progress = done ? 100 : Math.round((idx / total) * 100)
  const question = ASSESSMENT_QUESTIONS[idx]

  const suggestions = useMemo(
    () => (done ? suggestSOCs(answers) : []),
    [done, answers],
  )

  const onSelect = (value: string) => {
    if (!question) return
    const next = { ...answers, [question.id]: value }
    setAnswers(next)
    if (idx + 1 >= total) {
      setAssessmentResult({
        completedAt: new Date().toISOString(),
        answers: next,
        suggestions: suggestSOCs(next),
      })
      setDone(true)
    } else {
      setIdx((i) => i + 1)
    }
  }

  const reset = () => {
    setAnswers({})
    setIdx(0)
    setDone(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold">Find Your Occupation</h1>
      </div>
      <p className="mb-6 max-w-2xl text-muted-foreground">
        Answer {total} quick questions about what you do day-to-day. We'll suggest the
        Louisiana occupations (SOC codes) that best describe your role.
      </p>

      <Progress value={progress} className="mb-6" />

      {!done && question && (
        <Card>
          <CardContent className="p-6">
            <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
              Question {idx + 1} of {total}
            </p>
            <h2 className="mb-6 text-lg font-semibold">{question.prompt}</h2>
            <div className="space-y-2">
              {question.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSelect(opt.value)}
                  className="w-full rounded-md border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <span className="font-medium">{opt.label}</span>
                  {opt.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{opt.description}</p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {done && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Your top occupation matches</h2>
          {suggestions.length === 0 && (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                We couldn't narrow it down — try browsing{" "}
                <Link to="/occupations" className="underline">
                  all Louisiana occupations
                </Link>
                , or retake the assessment.
              </CardContent>
            </Card>
          )}
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <Card key={s.socCode} className={cn(i === 0 && "border-primary")}>
                <CardContent className="p-5">
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <div>
                      <p className="font-semibold">{s.socCode}</p>
                      <p className="text-sm text-muted-foreground">{s.rationale}</p>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(s.confidence * 100)}% match
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant={i === 0 ? "default" : "outline"}
                      onClick={() => {
                        setSOC(s.socCode)
                        navigate(`/occupations/${encodeURIComponent(s.socCode)}`)
                      }}
                      className="gap-1"
                    >
                      Use this SOC <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/occupations/${encodeURIComponent(s.socCode)}`}>
                        View details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={reset} className="gap-1">
              <RefreshCcw className="h-3.5 w-3.5" /> Retake
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/occupations">Browse all</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
