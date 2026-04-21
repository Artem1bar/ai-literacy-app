import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, Loader2, AlertCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
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

  const totalTokens = response
    ? response.usage.input_tokens + response.usage.output_tokens
    : 0

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Response
        </label>
        {response && (
          <div className="flex items-center gap-3">
            <span className="font-mono-data text-[10px] text-muted-foreground/70">
              [{response.model.replace(/^claude-/, "")}]
            </span>
            <span className="font-mono-data text-[10px] text-muted-foreground/70">
              {totalTokens} tokens
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopy}
              aria-label="Copy response"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/10 overflow-hidden">
        {/* Terminal header strip */}
        <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-3 py-1.5">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500/60" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
            <span className="h-2 w-2 rounded-full bg-green-500/60" />
          </div>
          <span className="font-mono-data text-[10px] text-muted-foreground/70 ml-2">
            claude — output
          </span>
          {isLoading && (
            <span className="ml-auto font-mono-data text-[10px] text-primary/80 flex items-center gap-1.5">
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
              streaming
            </span>
          )}
        </div>

        <div className="p-4 min-h-[260px]">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono-data text-xs text-muted-foreground"
              >
                <span className="text-primary">$</span> claude --think{" "}
                <span className="inline-block w-2 h-3 bg-primary/60 animate-pulse align-middle" />
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono-data text-[10px] uppercase tracking-wider mb-1 opacity-80">
                    // something went wrong
                  </p>
                  <p>{error}</p>
                </div>
              </motion.div>
            )}

            {response && !isLoading && !error && (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-background/60 prose-pre:border prose-pre:border-border/40 prose-code:font-mono-data prose-code:text-xs"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response.content}
                </ReactMarkdown>
              </motion.div>
            )}

            {!response && !isLoading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono-data text-xs text-muted-foreground/60"
              >
                <span className="text-primary/60">$</span> waiting for a prompt…
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
