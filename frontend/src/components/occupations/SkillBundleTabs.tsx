import { Wrench, Search, Shield, Target } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { SkillBundle, SkillItem } from "@/data/types"
import { cn } from "@/lib/utils"

interface SkillBundleTabsProps {
  bundle: SkillBundle
}

const DIMENSION_META = [
  {
    key: "technical",
    label: "Technical",
    icon: Wrench,
    color: "text-blue-500",
  },
  {
    key: "critical",
    label: "Critical",
    icon: Search,
    color: "text-amber-500",
  },
  {
    key: "ethical",
    label: "Ethical",
    icon: Shield,
    color: "text-emerald-500",
  },
  {
    key: "domainSpecific",
    label: "Domain",
    icon: Target,
    color: "text-purple-500",
  },
] as const

export function SkillBundleTabs({ bundle }: SkillBundleTabsProps) {
  return (
    <Tabs defaultValue="technical" className="w-full">
      <TabsList className="w-full justify-start">
        {DIMENSION_META.map((dim) => {
          const count = bundle[dim.key].length
          return (
            <TabsTrigger key={dim.key} value={dim.key} className="gap-1.5">
              <dim.icon className={cn("h-3.5 w-3.5", dim.color)} />
              {dim.label}
              <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px]">
                {count}
              </Badge>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {DIMENSION_META.map((dim) => (
        <TabsContent key={dim.key} value={dim.key} className="pt-4">
          <SkillList items={bundle[dim.key]} accentClass={dim.color} />
        </TabsContent>
      ))}
    </Tabs>
  )
}

function SkillList({ items, accentClass }: { items: readonly SkillItem[]; accentClass: string }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No skills authored for this dimension yet.
      </p>
    )
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-border p-4 transition-colors hover:border-primary/30"
        >
          <div className="mb-1 flex items-start justify-between gap-3">
            <h4 className={cn("text-sm font-semibold", accentClass)}>{item.title}</h4>
            <Badge variant="outline" className="text-[10px] uppercase">
              {item.priority}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{item.summary}</p>
          {(item.anchorTask || item.glossarySlug) && (
            <div className="mt-2 text-xs text-muted-foreground">
              {item.anchorTask && <span>Task: {item.anchorTask}</span>}
              {item.anchorTask && item.glossarySlug && <span> · </span>}
              {item.glossarySlug && (
                <a
                  href={`/glossary#${item.glossarySlug}`}
                  className="underline hover:text-foreground"
                >
                  {item.glossarySlug}
                </a>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
