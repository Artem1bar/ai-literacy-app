import { useState } from "react"
import { UserCircle, Trophy, RotateCcw } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ProgressBar } from "@/components/learn/ProgressBar"
import { ProfileSummary } from "@/components/profile/ProfileSummary"
import { MODULES } from "@/data/modules"
import { useProgressStore } from "@/store/progressStore"
import { useProfile } from "@/hooks/useProfile"

export default function Profile() {
  const { clearProfile } = useProfile()
  const { completed, quizScores, getModuleProgress, resetProgress } =
    useProgressStore()
  const [confirmReset, setConfirmReset] = useState(false)

  const totalSections = MODULES.reduce((s, m) => s + m.sections.length, 0)
  const completedSections = Object.values(completed).reduce(
    (s, arr) => s + arr.length,
    0,
  )
  const overallProgress =
    totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0

  const quizTotal = Object.keys(quizScores).length
  const quizCorrect = Object.values(quizScores).filter((s) => s === 1).length

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/onboarding">Run onboarding</Link>
        </Button>
      </div>

      <div className="mb-8">
        <ProfileSummary />
      </div>

      {/* Overall progress */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Overall Progress</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <ProgressBar value={overallProgress} label="All modules" />
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>
              {completedSections} / {totalSections} sections completed
            </span>
            {quizTotal > 0 && (
              <span>
                {quizCorrect} / {quizTotal} quizzes correct
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Per-module progress */}
      <div className="mb-8 space-y-3">
        <h2 className="font-semibold">Module Progress</h2>
        {MODULES.map((module) => {
          const progress = getModuleProgress(module.id, module.sections.length)
          const done = completed[module.id] ?? []
          return (
            <Card key={module.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Link
                    to={`/learn/${module.slug}`}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {module.title}
                  </Link>
                  <Badge
                    variant={progress === 100 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {done.length}/{module.sections.length}
                  </Badge>
                </div>
                <ProgressBar value={progress} showLabel={false} />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Reset */}
      <div className="flex flex-wrap gap-2 border-t border-border pt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmReset(true)}
          className="gap-1.5 text-destructive hover:text-destructive"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset progress
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearProfile}
          className="gap-1.5 text-muted-foreground"
        >
          Clear profile
        </Button>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset progress?</DialogTitle>
            <DialogDescription>
              This will clear all completed sections and quiz scores. Your profile
              (role, SOC, parish, etc.) is unaffected. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetProgress()
                setConfirmReset(false)
              }}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
