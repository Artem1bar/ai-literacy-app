import { Fragment } from "react"
import { GlossaryTooltip } from "@/components/glossary/GlossaryTooltip"

/**
 * Minimal inline-formatting parser for module body copy.
 *
 * Supported markup:
 *   **bold**
 *   [[term:slug]]           → renders `term` with a glossary tooltip on `slug`
 *   [[term:slug|display]]   → uses `display` as the visible anchor text
 */
export function RichText({ text }: { text: string }) {
  const nodes = parse(text)
  return <>{nodes}</>
}

function parse(source: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*|\[\[([^\]|:]+?):([a-z0-9-]+?)(?:\|([^\]]+))?\]\]/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let keyIdx = 0

  while ((match = regex.exec(source)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(source.slice(lastIndex, match.index))
    }
    if (match[1] !== undefined) {
      // Bold
      tokens.push(
        <strong key={`b-${keyIdx++}`} className="text-foreground">
          {match[1]}
        </strong>,
      )
    } else if (match[2] !== undefined && match[3] !== undefined) {
      const label = (match[4] ?? match[2]).trim()
      const slug = match[3]
      tokens.push(
        <GlossaryTooltip key={`g-${keyIdx++}`} slug={slug}>
          {label}
        </GlossaryTooltip>,
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < source.length) {
    tokens.push(source.slice(lastIndex))
  }
  return tokens.map((n, i) =>
    typeof n === "string" ? <Fragment key={`t-${i}`}>{n}</Fragment> : n,
  )
}
