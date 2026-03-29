import { useState } from "react"
import { ChevronDown, ChevronUp, Wand2 } from "lucide-react"
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
import type { PromptFramework } from "@/data/types"

interface FrameworkPickerProps {
  selected: PromptFramework | null
  values: Record<string, string>
  onSelect: (f: PromptFramework | null) => void
  onValueChange: (key: string, value: string) => void
  onCompose: () => void
}

export function FrameworkPicker({
  selected,
  values,
  onSelect,
  onValueChange,
  onCompose,
}: FrameworkPickerProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Framework (optional)
        </p>
        {selected && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Collapse" : "Expand steps"}
          </button>
        )}
      </div>

      <Select
        value={selected?.id ?? "none"}
        onValueChange={(v) =>
          onSelect(v === "none" ? null : (PROMPT_FRAMEWORKS.find((f) => f.id === v) ?? null))
        }
      >
        <SelectTrigger className="text-sm">
          <SelectValue placeholder="Choose a framework..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No framework</SelectItem>
          {PROMPT_FRAMEWORKS.map((f) => (
            <SelectItem key={f.id} value={f.id}>
              <div className="flex items-center gap-2">
                <span>{f.name}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  — {f.description.split(" — ")[0]}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selected && (
        <p className="mt-1.5 text-xs text-muted-foreground">{selected.description}</p>
      )}

      {selected && expanded && (
        <div className="mt-4 space-y-3">
          {selected.steps.map((step) => (
            <div key={step.key}>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px]">
                  {step.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{step.description}</span>
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
            Compose Prompt from Framework
          </Button>
        </div>
      )}
    </div>
  )
}
