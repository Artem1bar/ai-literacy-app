import { Link } from "react-router"
import { CheckCircle, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/store/progressStore"
import type { Module } from "@/data/types"

interface SidebarProps {
  module: Module
  activeSectionId?: string
}

export function Sidebar({ module, activeSectionId }: SidebarProps) {
  const completedMap = useProgressStore((s) => s.completed)
  const completed = completedMap[module.id] ?? []

  return (
    <aside className="w-56 shrink-0">
      <div className="sticky top-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sections
        </p>
        <nav className="flex flex-col gap-1">
          {module.sections.map((section) => {
            const isDone = completed.includes(section.id)
            const isActive = activeSectionId === section.id
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                {isDone ? (
                  <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-500" />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                )}
                <span className="line-clamp-2">{section.title}</span>
              </a>
            )
          })}
        </nav>
        <div className="mt-6">
          <Link
            to="/learn"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← All modules
          </Link>
        </div>
      </div>
    </aside>
  )
}
