import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { TemplateSelector } from "@/components/lab/TemplateSelector"
import { FrameworkPicker } from "@/components/lab/FrameworkPicker"
import { PromptEditor } from "@/components/lab/PromptEditor"
import { PromptScorer } from "@/components/lab/PromptScorer"
import { ResponseViewer } from "@/components/lab/ResponseViewer"
import { usePromptLab } from "@/hooks/usePromptLab"
import { useLabSeedStore, type LabSeed } from "@/store/labSeedStore"

export default function Lab() {
  const lab = usePromptLab()
  const storeSeed = useLabSeedStore((s) => s.seed)
  const clearSeed = useLabSeedStore((s) => s.clearSeed)

  // Mirror the incoming seed locally so the banner persists even after the
  // store is cleared (e.g. when the user dismisses or clears).
  const [activeSeed, setActiveSeed] = useState<LabSeed | null>(null)

  // Apply the seed whenever a fresh one appears in the store. The store is
  // intentionally NOT cleared here — Lab's usePromptLab state is local to
  // each mount, so React 19 Strict Mode + Suspense remounts need to reapply
  // on each mount. The store is cleared explicitly when the user dismisses
  // the banner or presses Clear.
  useEffect(() => {
    if (!storeSeed) return
    setActiveSeed(storeSeed)
    lab.setPrompt(storeSeed.prompt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSeed])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="label-comment text-primary/75 mb-3">// the workbench</p>
        <h1 className="text-3xl font-bold tracking-tight">Prompt Lab</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          A working prompt editor wired directly to Claude Sonnet 4.6.
          Start from a template, run it through a framework, or write freehand —
          then send it and see exactly what comes back. This is where the reading turns into practice.
        </p>
      </div>

      {/* Seeded challenge banner */}
      <AnimatePresence>
        {activeSeed && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="label-comment text-primary/75">// brought in from a module</p>
              <p className="text-sm font-medium truncate">
                {activeSeed.source.challengeTitle}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                from {activeSeed.source.moduleTitle}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => {
                setActiveSeed(null)
                clearSeed()
              }}
              aria-label="Dismiss challenge"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left panel — template + framework + scorer */}
        <div className="space-y-6">
          <TemplateSelector
            selected={lab.selectedTemplate}
            onSelect={lab.selectTemplate}
          />

          <Separator />

          <FrameworkPicker
            selected={lab.selectedFramework}
            values={lab.frameworkValues}
            onSelect={lab.selectFramework}
            onValueChange={lab.setFrameworkValue}
            onCompose={lab.composeFromFramework}
          />

          <Separator />

          <PromptScorer score={lab.score} />
        </div>

        {/* Right panel — editor + response */}
        <div className="flex flex-col gap-6">
          <PromptEditor
            value={lab.prompt}
            onChange={lab.setPrompt}
            onSubmit={() => void lab.submit()}
            onClear={() => {
              lab.clear()
              setActiveSeed(null)
              clearSeed()
            }}
            isLoading={lab.isLoading}
          />

          <ResponseViewer
            response={lab.response}
            isLoading={lab.isLoading}
            error={lab.error}
          />
        </div>
      </div>
    </div>
  )
}
