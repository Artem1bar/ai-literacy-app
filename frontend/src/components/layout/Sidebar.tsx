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
    <aside className="w-64 shrink-0">
      <div className="sticky top-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          In this module
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
                  "flex items-start gap-2.5 rounded-md px-3 py-2.5 text-base transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                {isDone ? (
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/60 mt-0.5" />
                )}
                <span className="line-clamp-2 leading-snug">{section.title}</span>
              </a>
            )
          })}
        </nav>
        <div className="mt-6">
          <Link
            to="/learn"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to all modules
          </Link>
        </div>
      </div>
    </aside>
  )
}
