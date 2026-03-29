import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PROMPT_TEMPLATES } from "@/data/prompt-templates"
import type { PromptTemplate } from "@/data/types"

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "student", label: "Student" },
  { id: "professor", label: "Professor" },
  { id: "developer", label: "Developer" },
  { id: "general", label: "General" },
] as const

interface TemplateSelectorProps {
  selected: PromptTemplate | null
  onSelect: (template: PromptTemplate) => void
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Templates
      </p>
      <Tabs defaultValue="all">
        <TabsList className="flex-wrap h-auto gap-1 mb-3">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => {
          const templates =
            cat.id === "all"
              ? PROMPT_TEMPLATES
              : PROMPT_TEMPLATES.filter((t) => t.category === cat.id)

          return (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className={cn(
                      "w-full text-left rounded-md border px-3 py-2 text-sm transition-all hover:border-primary/50 hover:bg-accent/50",
                      selected?.id === t.id && "border-primary bg-primary/10",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">{t.title}</span>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {t.framework}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
