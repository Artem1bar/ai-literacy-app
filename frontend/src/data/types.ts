export type UserRole = "student" | "professor" | "developer"

export interface RoleConfig {
  readonly id: UserRole
  readonly label: string
  readonly description: string
  readonly icon: string
  readonly color: string
}

// Content block discriminated union
export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | CodeBlock
  | CalloutBlock
  | ImageBlock
  | QuizBlock
  | DividerBlock

export interface HeadingBlock {
  readonly type: "heading"
  readonly level: 2 | 3 | 4
  readonly text: string
}

export interface ParagraphBlock {
  readonly type: "paragraph"
  readonly text: string
}

export interface ListBlock {
  readonly type: "list"
  readonly style: "ordered" | "unordered"
  readonly items: readonly string[]
}

export interface CodeBlock {
  readonly type: "code"
  readonly language: string
  readonly code: string
  readonly caption?: string
}

export interface CalloutBlock {
  readonly type: "callout"
  readonly variant: "info" | "warning" | "tip" | "important"
  readonly title?: string
  readonly text: string
}

export interface ImageBlock {
  readonly type: "image"
  readonly src: string
  readonly alt: string
  readonly caption?: string
}

export interface QuizBlock {
  readonly type: "quiz"
  readonly id: string
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
  readonly explanation: string
}

export interface DividerBlock {
  readonly type: "divider"
}

export interface Section {
  readonly id: string
  readonly title: string
  readonly blocks: readonly ContentBlock[]
}

export interface Module {
  readonly id: string
  readonly slug: string
  readonly title: string
  readonly description: string
  readonly icon: string
  readonly roles: readonly UserRole[]
  readonly estimatedMinutes: number
  readonly prerequisites: readonly string[]
  readonly sections: readonly Section[]
}

export interface TemplatePlaceholder {
  readonly key: string
  readonly label: string
  readonly type: "text" | "textarea" | "select"
  readonly options?: readonly string[]
  readonly defaultValue?: string
}

export interface PromptTemplate {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: "student" | "professor" | "developer" | "general"
  readonly roles: readonly UserRole[]
  readonly framework: string
  readonly template: string
  readonly placeholders: readonly TemplatePlaceholder[]
}

export interface FrameworkStep {
  readonly key: string
  readonly label: string
  readonly description: string
  readonly placeholder: string
}

export interface PromptFramework {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly steps: readonly FrameworkStep[]
  readonly assembler: (values: Record<string, string>) => string
}

export interface Resource {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly url: string
  readonly category: ResourceCategory
  readonly roles: readonly UserRole[]
  readonly tags: readonly string[]
}

export type ResourceCategory =
  | "official-docs"
  | "ai-literacy-frameworks"
  | "prompt-engineering"
  | "github-repos"
  | "research-papers"
  | "tools-plugins"
