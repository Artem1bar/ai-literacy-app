import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Info, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/store/progressStore"
import type { ContentBlock } from "@/data/types"

interface ContentRendererProps {
  blocks: readonly ContentBlock[]
  moduleId: string
  sectionId: string
}

export function ContentRenderer({ blocks, moduleId, sectionId }: ContentRendererProps) {
  return (
    <div className="space-y-6 text-lg">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} moduleId={moduleId} sectionId={sectionId} />
      ))}
    </div>
  )
}

function BlockRenderer({
  block,
  moduleId,
  sectionId,
}: {
  block: ContentBlock
  moduleId: string
  sectionId: string
}) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} />
    case "paragraph":
      return <ParagraphBlock block={block} />
    case "list":
      return <ListBlock block={block} />
    case "code":
      return <CodeBlock block={block} />
    case "callout":
      return <CalloutBlock block={block} />
    case "quiz":
      return <QuizBlock block={block} moduleId={moduleId} sectionId={sectionId} />
    case "divider":
      return <hr className="border-border" />
    case "image":
      return (
        <figure>
          <img src={block.src} alt={block.alt} className="rounded-lg w-full" />
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
  }
}

function HeadingBlock({ block }: { block: Extract<ContentBlock, { type: "heading" }> }) {
  const classes = {
    2: "text-3xl font-bold mt-10 mb-3 first:mt-0 leading-tight",
    3: "text-xl font-semibold mt-8 mb-2 leading-snug",
    4: "text-lg font-semibold mt-6 mb-1",
  }
  const Tag = `h${block.level}` as "h2" | "h3" | "h4"
  return <Tag className={classes[block.level]}>{block.text}</Tag>
}

function ParagraphBlock({ block }: { block: Extract<ContentBlock, { type: "paragraph" }> }) {
  // Simple bold markdown inline: **text**
  const html = block.text.replace(/\*\*(.+?)\*\*/g, "<strong class='text-foreground font-semibold'>$1</strong>")
  return (
    <p
      className="text-foreground/85 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function ListBlock({ block }: { block: Extract<ContentBlock, { type: "list" }> }) {
  const Tag = block.style === "ordered" ? "ol" : "ul"
  return (
    <Tag className={cn(
      "space-y-2 pl-6 text-foreground/85",
      block.style === "ordered" ? "list-decimal" : "list-disc",
    )}>
      {block.items.map((item, i) => {
        const html = item.replace(/\*\*(.+?)\*\*/g, "<strong class='text-foreground font-semibold'>$1</strong>")
        return (
          <li
            key={i}
            className="leading-relaxed pl-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      })}
    </Tag>
  )
}

function CodeBlock({ block }: { block: Extract<ContentBlock, { type: "code" }> }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(block.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <figure className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2.5 border-b border-border">
        <span className="text-sm font-mono text-muted-foreground">{block.language}</span>
        <button
          onClick={handleCopy}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 bg-muted/20">
        <code className="text-sm font-mono text-foreground leading-relaxed">{block.code}</code>
      </pre>
      {block.caption && (
        <figcaption className="px-4 py-2.5 text-sm text-muted-foreground border-t border-border bg-muted/20">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

const CALLOUT_STYLES = {
  info: { Icon: Info, bg: "bg-blue-500/10 border-blue-500/30", icon: "text-blue-500" },
  warning: { Icon: AlertTriangle, bg: "bg-yellow-500/10 border-yellow-500/30", icon: "text-yellow-500" },
  tip: { Icon: Lightbulb, bg: "bg-green-500/10 border-green-500/30", icon: "text-green-500" },
  important: { Icon: AlertCircle, bg: "bg-red-500/10 border-red-500/30", icon: "text-red-500" },
}

function CalloutBlock({ block }: { block: Extract<ContentBlock, { type: "callout" }> }) {
  const { Icon, bg, icon } = CALLOUT_STYLES[block.variant]
  return (
    <div className={cn("rounded-lg border p-5", bg)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", icon)} />
        <div>
          {block.title && (
            <p className="text-base font-semibold mb-1.5 text-foreground">{block.title}</p>
          )}
          <p className="text-base text-foreground/85 leading-relaxed">{block.text}</p>
        </div>
      </div>
    </div>
  )
}

function QuizBlock({
  block,
  moduleId,
  sectionId,
}: {
  block: Extract<ContentBlock, { type: "quiz" }>
  moduleId: string
  sectionId: string
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const recordQuizAttempt = useProgressStore((s) => s.recordQuizAttempt)

  const isCorrect = selected === block.correctIndex

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    recordQuizAttempt({
      quizId: block.id,
      score: isCorrect ? 1 : 0,
      moduleId,
      sectionId,
    })
  }

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-6">
      <p className="text-lg font-medium mb-5 leading-snug">{block.question}</p>
      <div className="space-y-2">
        {block.options.map((option, i) => {
          const isSelected = selected === i
          const showResult = submitted && isSelected
          return (
            <motion.button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              whileHover={!submitted ? { x: 2 } : {}}
              whileTap={!submitted ? { scale: 0.99 } : {}}
              animate={isSelected && !submitted ? { scale: [1, 1.01, 1] } : {}}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                "w-full text-left rounded-md border px-4 py-3 text-base transition-colors",
                !submitted && "hover:border-primary/50 hover:bg-primary/5",
                isSelected && !submitted && "border-primary bg-primary/10",
                showResult && isCorrect && "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                showResult && !isCorrect && "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                submitted && !isSelected && i === block.correctIndex && "border-green-500/50 bg-green-500/5",
              )}
            >
              <span className="flex items-center gap-2.5">
                {showResult && isCorrect && <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />}
                {showResult && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-red-500" />}
                {option}
              </span>
            </motion.button>
          )
        })}
      </div>

      {!submitted ? (
        <Button
          className="mt-5"
          onClick={handleSubmit}
          disabled={selected === null}
        >
          Submit answer
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "mt-5 rounded-md p-4 text-base",
              isCorrect ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400",
            )}
          >
            <p className="font-semibold mb-1.5">{isCorrect ? "Correct." : "Not quite."}</p>
            <p className="leading-relaxed">{block.explanation}</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
