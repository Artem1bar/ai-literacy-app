import { useState } from "react"
import { UserCircle, Trophy, RotateCcw, GraduationCap, BookOpen, Code } from "lucide-react"
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
import { MODULES } from "@/data/modules"
import { useProgressStore } from "@/store/progressStore"
import { useRole } from "@/hooks/useRole"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/data/types"

const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  student: GraduationCap,
  professor: BookOpen,
  developer: Code,
}

const ROLE_COLORS: Record<UserRole, string> = {
  student: "text-blue-500",
  professor: "text-purple-500",
  developer: "text-green-500",
}

export default function Profile() {
  const { role, roleConfig, setRole } = useRole()
  const { completed, quizScores, getModuleProgress, resetProgress } = useProgressStore()
  const [confirmReset, setConfirmReset] = useState(false)

  const totalSections = MODULES.reduce((s, m) => s + m.sections.length, 0)
  const completedSections = Object.values(completed).reduce((s, arr) => s + arr.length, 0)
  const overallProgress = totalSections > 0
    ? Math.round((completedSections / totalSections) * 100)
    : 0

  const quizTotal = Object.keys(quizScores).length
  const quizCorrect = Object.values(quizScores).filter((s) => s === 1).length

  const RoleIcon = role ? ROLE_ICONS[role] : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-8">
        <UserCircle className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      {/* Role card */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {RoleIcon && role && (
                <div className="rounded-lg bg-muted p-2.5">
                  <RoleIcon className={cn("h-5 w-5", ROLE_COLORS[role])} />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Current role</p>
                <p className="font-semibold">
                  {roleConfig?.label ?? "No role selected"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["student", "professor", "developer"] as UserRole[]).map((r) => {
                const Icon = ROLE_ICONS[r]
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    aria-pressed={role === r}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-all",
                      role === r
                        ? "border-primary bg-primary/10 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:border-primary/40",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="capitalize">{r}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall progress */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Overall Progress</h2>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <ProgressBar value={overallProgress} label="All modules" />
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{completedSections} / {totalSections} sections completed</span>
            {quizTotal > 0 && (
              <span>{quizCorrect} / {quizTotal} quizzes correct</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Per-module progress */}
      <div className="space-y-3 mb-8">
        <h2 className="font-semibold">Module Progress</h2>
        {MODULES.map((module) => {
          const progress = getModuleProgress(module.id, module.sections.length)
          const done = completed[module.id] ?? []
          return (
            <Card key={module.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/learn/${module.slug}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {module.title}
                  </Link>
                  <Badge variant={progress === 100 ? "default" : "secondary"} className="text-xs">
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
      <div className="border-t border-border pt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirmReset(true)}
          className="gap-1.5 text-destructive hover:text-destructive"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All Progress
        </Button>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset progress?</DialogTitle>
            <DialogDescription>
              This will clear all completed sections and quiz scores. This cannot be undone.
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
