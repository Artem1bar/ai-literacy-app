import { FlaskConical } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { TemplateSelector } from "@/components/lab/TemplateSelector"
import { FrameworkPicker } from "@/components/lab/FrameworkPicker"
import { PromptEditor } from "@/components/lab/PromptEditor"
import { ResponseViewer } from "@/components/lab/ResponseViewer"
import { PromptScorer } from "@/components/lab/PromptScorer"
import { usePromptLab } from "@/hooks/usePromptLab"

export default function Lab() {
  const lab = usePromptLab()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold">Prompt Lab</h1>
      </div>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Experiment with prompts using proven frameworks and live Claude Sonnet 4.6 API calls.
        Select a template, choose a framework, refine your prompt, and see the results instantly.
      </p>

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
            onClear={lab.clear}
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
