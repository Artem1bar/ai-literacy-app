import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router"
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getDueReviews, type DueReview } from "@/lib/spacedRepetition"
import { useProgressStore } from "@/store/progressStore"

export function QuizReview() {
  const quizAttempts = useProgressStore((s) => s.quizAttempts)
  const recordQuizAttempt = useProgressStore((s) => s.recordQuizAttempt)

  // Snapshot the "due" set when this component mounts so answering a question
  // doesn't immediately drop it off the list mid-session.
  const dueQueue = useMemo<DueReview[]>(
    () => getDueReviews(quizAttempts),
    // Intentionally not reacting to quizAttempts — we want a stable session queue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (dueQueue.length === 0) return null

  const current = dueQueue[index]
  const isCorrect = selected === current.correctIndex
  const hasMore = index < dueQueue.length - 1

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    recordQuizAttempt({
      quizId: current.quizId,
      score: isCorrect ? 1 : 0,
      moduleId: current.moduleId,
      sectionId: current.sectionId,
    })
  }

  const handleNext = () => {
    if (!hasMore) return
    setIndex((i) => i + 1)
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <Card className="mb-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Due for review</h2>
          </div>
          <span className="font-mono-data text-[10px] text-muted-foreground">
            {index + 1} / {dueQueue.length}
          </span>
        </div>
        <p className="label-comment text-primary/60 mt-1">
          // spaced repetition · {current.reason === "missed" ? "missed last time" : "it's been a while"}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.quizId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Link
                to={`/learn/${current.moduleSlug}`}
                className="font-mono-data text-[10px] text-primary/80 hover:text-primary transition-colors"
              >
                [{current.moduleTitle}]
              </Link>
              <span className="font-mono-data text-[10px] text-muted-foreground/60">
                · {current.sectionTitle}
              </span>
            </div>

            <p className="font-medium mb-4">{current.question}</p>

            <div className="space-y-2">
              {current.options.map((option, i) => {
                const isSelected = selected === i
                const showResult = submitted && isSelected
                return (
                  <motion.button
                    key={i}
                    onClick={() => !submitted && setSelected(i)}
                    disabled={submitted}
                    whileHover={!submitted ? { x: 2 } : {}}
                    whileTap={!submitted ? { scale: 0.99 } : {}}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                      "w-full text-left rounded-md border px-4 py-2.5 text-sm transition-colors",
                      !submitted && "hover:border-primary/50 hover:bg-primary/5",
                      isSelected && !submitted && "border-primary bg-primary/10",
                      showResult && isCorrect && "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                      showResult && !isCorrect && "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                      submitted && !isSelected && i === current.correctIndex && "border-green-500/50 bg-green-500/5",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {showResult && isCorrect && <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />}
                      {showResult && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-red-500" />}
                      {option}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={cn(
                  "mt-4 rounded-md p-3 text-sm",
                  isCorrect
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-red-500/10 text-red-700 dark:text-red-400",
                )}
              >
                <p className="font-semibold mb-1">
                  {isCorrect ? "Got it — back in the rotation." : "Not quite — here's why."}
                </p>
                <p>{current.explanation}</p>
              </motion.div>
            )}

            <div className="mt-4 flex items-center justify-between">
              {!submitted ? (
                <Button size="sm" onClick={handleSubmit} disabled={selected === null}>
                  Submit Answer
                </Button>
              ) : hasMore ? (
                <Button size="sm" onClick={handleNext} className="gap-1.5">
                  Next review
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Caught up for now — come back tomorrow.
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
