import { useState } from "react"
import { sendPrompt, type PromptResponse, ApiError } from "@/lib/api"
import type { PromptTemplate, PromptFramework } from "@/data/types"

interface PromptLabState {
  prompt: string
  setPrompt: (p: string) => void
  selectedTemplate: PromptTemplate | null
  selectTemplate: (t: PromptTemplate) => void
  selectedFramework: PromptFramework | null
  selectFramework: (f: PromptFramework | null) => void
  frameworkValues: Record<string, string>
  setFrameworkValue: (key: string, value: string) => void
  composeFromFramework: () => void
  response: PromptResponse | null
  isLoading: boolean
  error: string | null
  score: PromptScore | null
  submit: () => Promise<void>
  clear: () => void
}

export interface PromptScore {
  total: number
  breakdown: { label: string; score: number; max: number; note: string }[]
}

function scorePrompt(prompt: string): PromptScore {
  const breakdown: PromptScore["breakdown"] = []

  // Length (1-5 pts)
  const len = prompt.trim().length
  const lenScore = len < 20 ? 1 : len < 80 ? 2 : len < 200 ? 3 : len < 500 ? 4 : 5
  breakdown.push({
    label: "Detail & length",
    score: lenScore,
    max: 5,
    note:
      len < 80
        ? "Too brief — add context or constraints"
        : len > 3000
          ? "Very long — consider trimming"
          : "Good length",
  })

  // Role instruction (0-3 pts)
  const hasRole = /you are|act as|as an?|role:/i.test(prompt)
  breakdown.push({
    label: "Role instruction",
    score: hasRole ? 3 : 0,
    max: 3,
    note: hasRole ? "Has role instruction" : 'Consider adding "You are a ..." instruction',
  })

  // Format specification (0-3 pts)
  const hasFormat =
    /format|structure|list|table|section|heading|bullet|markdown|numbered|paragraph/i.test(
      prompt,
    )
  breakdown.push({
    label: "Output format",
    score: hasFormat ? 3 : 0,
    max: 3,
    note: hasFormat
      ? "Specifies output format"
      : "Consider specifying how the response should be formatted",
  })

  // Specificity (0-4 pts)
  const hasConstraints = /must|should|only|no more than|at least|maximum|minimum|avoid|don't|do not/i.test(prompt)
  const hasContext = /context|background|because|given that|situation/i.test(prompt)
  breakdown.push({
    label: "Specificity & constraints",
    score: (hasConstraints ? 2 : 0) + (hasContext ? 2 : 0),
    max: 4,
    note: [
      !hasConstraints && "Add constraints (e.g. length, scope)",
      !hasContext && "Add background context",
    ]
      .filter(Boolean)
      .join("; ") || "Clear constraints and context",
  })

  // XML structure (0-5 pts)
  const xmlTagCount = (prompt.match(/<[a-z_]+>/g) ?? []).length
  const xmlScore = xmlTagCount === 0 ? 0 : xmlTagCount < 2 ? 2 : xmlTagCount < 4 ? 3 : 5
  breakdown.push({
    label: "Structure (XML tags)",
    score: xmlScore,
    max: 5,
    note:
      xmlTagCount === 0
        ? "No XML tags — consider using <context>, <task>, <format> for Claude"
        : `Uses ${xmlTagCount} XML tag${xmlTagCount !== 1 ? "s" : ""} for structure`,
  })

  const total = Math.min(
    100,
    Math.round((breakdown.reduce((s, b) => s + b.score, 0) / 20) * 100),
  )
  return { total, breakdown }
}

export function usePromptLab(): PromptLabState {
  const [prompt, setPrompt] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [selectedFramework, setSelectedFramework] = useState<PromptFramework | null>(null)
  const [frameworkValues, setFrameworkValues] = useState<Record<string, string>>({})
  const [response, setResponse] = useState<PromptResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [score, setScore] = useState<PromptScore | null>(null)

  const selectTemplate = (t: PromptTemplate) => {
    setSelectedTemplate(t)
    setPrompt(t.template)
    setScore(scorePrompt(t.template))
    setResponse(null)
    setError(null)
  }

  const selectFramework = (f: PromptFramework | null) => {
    setSelectedFramework(f)
    setFrameworkValues({})
  }

  const setFrameworkValue = (key: string, value: string) => {
    setFrameworkValues((prev) => ({ ...prev, [key]: value }))
  }

  const composeFromFramework = () => {
    if (!selectedFramework) return
    const composed = selectedFramework.assembler(frameworkValues)
    setPrompt(composed)
    setScore(scorePrompt(composed))
  }

  const handleSetPrompt = (p: string) => {
    setPrompt(p)
    setScore(scorePrompt(p))
  }

  const submit = async () => {
    if (!prompt.trim() || isLoading) return
    setIsLoading(true)
    setError(null)
    setResponse(null)
    try {
      const result = await sendPrompt({ prompt })
      setResponse(result)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to connect to the backend. Make sure the server is running.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clear = () => {
    setPrompt("")
    setSelectedTemplate(null)
    setSelectedFramework(null)
    setFrameworkValues({})
    setResponse(null)
    setError(null)
    setScore(null)
  }

  return {
    prompt,
    setPrompt: handleSetPrompt,
    selectedTemplate,
    selectTemplate,
    selectedFramework,
    selectFramework,
    frameworkValues,
    setFrameworkValue,
    composeFromFramework,
    response,
    isLoading,
    error,
    score,
    submit,
    clear,
  }
}
