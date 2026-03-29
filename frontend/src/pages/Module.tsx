import { useEffect, useRef, useState } from "react"
import { useParams, Link, Navigate } from "react-router"
import { CheckCircle, Circle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sidebar } from "@/components/layout/Sidebar"
import { ContentRenderer } from "@/components/learn/ContentRenderer"
import { ProgressBar } from "@/components/learn/ProgressBar"
import { MODULES } from "@/data/modules"
import { useProgressStore } from "@/store/progressStore"

export default function Module() {
  const { slug } = useParams<{ slug: string }>()
  const module = MODULES.find((m) => m.slug === slug)

  const completed = useProgressStore((s) => s.completed[module?.id ?? ""] ?? [])
  const getModuleProgress = useProgressStore((s) => s.getModuleProgress)
  const markSectionComplete = useProgressStore((s) => s.markSectionComplete)
  const markSectionIncomplete = useProgressStore((s) => s.markSectionIncomplete)

  const [activeSectionId, setActiveSectionId] = useState<string>("")
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  if (!module) return <Navigate to="/learn" replace />

  const progress = getModuleProgress(module.id, module.sections.length)
  const currentIndex = module.sections.findIndex((s) => s.id === activeSectionId)
  const prevSection = currentIndex > 0 ? module.sections[currentIndex - 1] : null
  const nextSection = currentIndex < module.sections.length - 1 ? module.sections[currentIndex + 1] : null

  // Scroll-spy
  useEffect(() => {
    if (module.sections.length > 0) setActiveSectionId(module.sections[0].id)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSectionId(visible[0].target.id)
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    )
    Object.values(sectionRefs.current).forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [module])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/learn" className="hover:text-foreground transition-colors">
          Learn
        </Link>
        <span>/</span>
        <span className="text-foreground">{module.title}</span>
      </div>

      {/* Module header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{module.title}</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">{module.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {module.estimatedMinutes} min
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex gap-1">
                {module.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs capitalize">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="w-48">
            <ProgressBar value={progress} label="Progress" />
          </div>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar (desktop) */}
        <div className="hidden lg:block">
          <Sidebar module={module} activeSectionId={activeSectionId} />
        </div>

        {/* Content */}
        <article className="flex-1 min-w-0 space-y-14">
          {module.sections.map((section) => {
            const isDone = completed.includes(section.id)
            return (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => { if (el) sectionRefs.current[section.id] = el }}
                className="scroll-mt-20"
              >
                <ContentRenderer blocks={section.blocks} />

                <Separator className="mt-8 mb-4" />

                {/* Section completion */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      isDone
                        ? markSectionIncomplete(module.id, section.id)
                        : markSectionComplete(module.id, section.id)
                    }
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isDone ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4" />
                        <span>Mark as complete</span>
                      </>
                    )}
                  </button>
                </div>
              </section>
            )
          })}

          {/* Prev / Next navigation */}
          <div className="flex justify-between pt-4 border-t border-border">
            {prevSection ? (
              <Button variant="outline" size="sm" asChild>
                <a href={`#${prevSection.id}`} className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  {prevSection.title}
                </a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/learn" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  All modules
                </Link>
              </Button>
            )}
            {nextSection ? (
              <Button variant="outline" size="sm" asChild>
                <a href={`#${nextSection.id}`} className="gap-1">
                  {nextSection.title}
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link to="/learn" className="gap-1">
                  Back to modules
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
