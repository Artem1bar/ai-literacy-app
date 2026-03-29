import { Send, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface PromptEditorProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onClear: () => void
  isLoading: boolean
}

export function PromptEditor({ value, onChange, onSubmit, onClear, isLoading }: PromptEditorProps) {
  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="prompt-editor" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Prompt
        </label>
        <span className="text-xs text-muted-foreground">
          {value.length.toLocaleString()} chars · ⌘↵ to send
        </span>
      </div>
      <Textarea
        id="prompt-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Write your prompt here, or select a template above..."
        className="min-h-[260px] font-mono text-sm resize-y"
        disabled={isLoading}
      />
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={isLoading || !value}
          className="gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {isLoading ? "Sending..." : "Send to Claude"}
        </Button>
      </div>
    </div>
  )
}
