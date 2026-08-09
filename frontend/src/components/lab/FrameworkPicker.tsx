import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Wand2, ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PROMPT_FRAMEWORKS } from "@/data/prompt-frameworks"
import { cn } from "@/lib/utils"
import type { PromptFramework } from "@/data/types"

interface FrameworkPickerProps {
  selected: PromptFramework | null
  values: Record<string, string>
  onSelect: (f: PromptFramework | null) => void
  onValueChange: (key: string, value: string) => void
  onCompose: () => void
}

type Mode = "collapsed" | "expanded" | "guided"

export function FrameworkPicker({
  selected,
  values,
  onSelect,
  onValueChange,
  onCompose,
}: FrameworkPickerProps) {
  const [mode, setMode] = useState<Mode>("collapsed")
  const [guidedStep, setGuidedStep] = useState(0)

  const handleSelect = (f: PromptFramework | null) => {
    onSelect(f)
    setGuidedStep(0)
    if (!f) setMode("collapsed")
  }

  const totalSteps = selected?.steps.length ?? 0
  const currentStep = selected?.steps[guidedStep]
  const filledCount = selected
    ? selected.steps.filter((s) => (values[s.key] ?? "").trim().length > 0).length
    : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Framework · optional
        </p>
        {selected && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMode(mode === "guided" ? "expanded" : "guided")}
              className={cn(
                "flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors",
                mode === "guided"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30",
              )}
            >
              <Sparkles className="h-3 w-3" />
              Guided
            </button>
            <button
              onClick={() =>
                setMode((m) => (m === "expanded" ? "collapsed" : "expanded"))
              }
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              {mode === "expanded" ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {mode === "expanded" ? "Collapse" : "See all steps"}
            </button>
          </div>
        )}
      </div>

      <Select
        value={selected?.id ?? "none"}
        onValueChange={(v) =>
          handleSelect(
            v === "none"
              ? null
              : (PROMPT_FRAMEWORKS.find((f) => f.id === v) ?? null),
          )
        }
      >
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Pick a framework to scaffold with…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Freehand (no framework)</SelectItem>
          {PROMPT_FRAMEWORKS.map((f) => (
            <SelectItem key={f.id} value={f.id}>
              <div className="flex items-center gap-2">
                <span>{f.name}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  — {f.description.split(".")[0]}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected && (
        <p className="mt-1.5 text-xs text-muted-foreground">{selected.description}</p>
      )}

      {/* Expanded (all steps at once) */}
      <AnimatePresence mode="wait">
        {selected && mode === "expanded" && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            {selected.steps.map((step) => (
              <div key={step.key}>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    {step.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </div>
                <Textarea
                  value={values[step.key] ?? ""}
                  onChange={(e) => onValueChange(step.key, e.target.value)}
                  placeholder={step.placeholder}
                  className="text-sm min-h-[60px] resize-none"
                  rows={2}
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="secondary"
              onClick={onCompose}
              className="gap-1.5 w-full"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Assemble prompt
            </Button>
          </motion.div>
        )}

        {/* Guided (one step at a time) */}
        {selected && mode === "guided" && currentStep && (
          <motion.div
            key="guided"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            {/* Progress dots */}
            <div className="flex items-center gap-1.5 mb-3">
              {selected.steps.map((s, i) => {
                const filled = (values[s.key] ?? "").trim().length > 0
                return (
                  <button
                    key={s.key}
                    onClick={() => setGuidedStep(i)}
                    aria-label={`Step ${i + 1}: ${s.label}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === guidedStep
                        ? "w-6 bg-primary"
                        : filled
                          ? "w-1.5 bg-primary/60"
                          : "w-1.5 bg-border",
                    )}
                  />
                )
              })}
              <span className="ml-auto font-mono-data text-[10px] text-muted-foreground">
                {guidedStep + 1} / {totalSteps}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.key}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[10px]">
                    {currentStep.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                  {currentStep.description}
                </p>
                <Textarea
                  value={values[currentStep.key] ?? ""}
                  onChange={(e) => onValueChange(currentStep.key, e.target.value)}
                  placeholder={currentStep.placeholder}
                  className="text-sm min-h-[96px] resize-none"
                  rows={4}
                  autoFocus
                />
              </motion.div>
            </AnimatePresence>

            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setGuidedStep((s) => Math.max(0, s - 1))}
                disabled={guidedStep === 0}
                className="gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back
              </Button>
              {guidedStep < totalSteps - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setGuidedStep((s) => Math.min(totalSteps - 1, s + 1))}
                  className="gap-1 flex-1"
                >
                  Next
                  <ArrowRight className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onCompose}
                  disabled={filledCount === 0}
                  className="gap-1.5 flex-1"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Assemble prompt
                </Button>
              )}
            </div>

            <p className="mt-2 font-mono-data text-[10px] text-muted-foreground/70">
              // {filledCount} of {totalSteps} filled in
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
