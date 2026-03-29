import { useState } from "react"
import { Copy, Check, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PromptResponse } from "@/lib/api"

interface ResponseViewerProps {
  response: PromptResponse | null
  isLoading: boolean
  error: string | null
}

export function ResponseViewer({ response, isLoading, error }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!response) return
    void navigator.clipboard.writeText(response.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Response
        </label>
        {response && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              {response.model.replace("claude-", "").replace("-20250514", "")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {response.usage.input_tokens + response.usage.output_tokens} tokens
            </Badge>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy} aria-label="Copy response">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 rounded-lg border border-border bg-muted/10 min-h-[260px]">
        <div className="p-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="animate-pulse">Claude is thinking...</span>
            </div>
          )}
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {response && !isLoading && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response.content}
              </ReactMarkdown>
            </div>
          )}
          {!response && !isLoading && !error && (
            <p className="text-muted-foreground text-sm">
              Your response will appear here after you send a prompt.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
