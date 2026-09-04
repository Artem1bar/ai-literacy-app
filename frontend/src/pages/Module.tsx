import { useEffect, useRef, useState } from "react"
import { useParams, Link, Navigate, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { CheckCircle, Circle, Clock, ChevronLeft, ChevronRight, FlaskConical, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sidebar } from "@/components/layout/Sidebar"
import { ContentRenderer } from "@/components/learn/ContentRenderer"
import { ProgressBar } from "@/components/learn/ProgressBar"
import { MODULES } from "@/data/modules"
import { useProgressStore } from "@/store/progressStore"
import { useLabSeedStore } from "@/store/labSeedStore"
import { BACKEND_ENABLED, ROUTES } from "@/lib/constants"

export default function Module() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const module = MODULES.find((m) => m.slug === slug)

  const completedMap = useProgressStore((s) => s.completed)
  const completed = completedMap[module?.id ?? ""] ?? []
  const getModuleProgress = useProgressStore((s) => s.getModuleProgress)
  const markSectionComplete = useProgressStore((s) => s.markSectionComplete)
  const markSectionIncomplete = useProgressStore((s) => s.markSectionIncomplete)
  const setLabSeed = useLabSeedStore((s) => s.setSeed)

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  // Scroll-spy — subscribes to IntersectionObserver only.
  // Hook runs unconditionally to satisfy rules-of-hooks; bails out when module is missing.
  useEffect(() => {
    if (!module) return
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

  if (!module) return <Navigate to="/learn" replace />

  // Derive the effective section: fall back to the first section either when
  // the observer hasn't fired yet OR when the tracked id belongs to a previous
  // module (switching slugs without unmounting).
  const effectiveSectionId =
    activeSectionId && module.sections.some((s) => s.id === activeSectionId)
      ? activeSectionId
      : module.sections[0]?.id ?? ""

  const progress = getModuleProgress(module.id, module.sections.length)
  const currentIndex = module.sections.findIndex((s) => s.id === effectiveSectionId)
  const prevSection = currentIndex > 0 ? module.sections[currentIndex - 1] : null
  const nextSection = currentIndex < module.sections.length - 1 ? module.sections[currentIndex + 1] : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-base text-muted-foreground mb-6">
        <Link to="/learn" className="hover:text-foreground transition-colors">
          Learn
        </Link>
        <span>/</span>
        <span className="text-foreground">{module.title}</span>
      </div>

      {/* Module header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">{module.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed">{module.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-base text-muted-foreground">
                <Clock className="h-4 w-4" />
                {module.estimatedMinutes} min
              </div>
              <Separator orientation="vertical" className="h-5" />
              <div className="flex gap-1.5">
                {module.roles.map((role) => (
                  <span key={role} className="font-mono-data text-xs px-2 py-0.5 rounded border border-border/60 text-muted-foreground">
                    [{role}]
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="w-56">
            <ProgressBar value={progress} label="Module progress" />
          </div>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar (desktop) */}
        <div className="hidden lg:block">
          <Sidebar module={module} activeSectionId={effectiveSectionId} />
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
                <ContentRenderer
                  blocks={section.blocks}
                  moduleId={module.id}
                  sectionId={section.id}
                />

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
                        <span>Finished this section</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4" />
                        <span>Mark this section done</span>
                      </>
                    )}
                  </button>
                </div>
              </section>
            )
          })}

          {/* Try in Lab CTA */}
          {module.labChallenge && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="rounded-lg border border-primary/30 bg-primary/5 p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="rounded border border-primary/30 bg-primary/10 p-1.5 shrink-0">
                  <FlaskConical className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="label-comment text-primary/75 mb-1">// hands-on challenge</p>
                  <h3 className="font-semibold text-base leading-tight">
                    {module.labChallenge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {module.labChallenge.brief}
                  </p>
                </div>
              </div>
              {BACKEND_ENABLED ? (
                <Button
                  size="sm"
                  className="gap-1.5 w-full sm:w-auto"
                  onClick={() => {
                    if (!module.labChallenge) return
                    setLabSeed({
                      prompt: module.labChallenge.starterPrompt,
                      source: {
                        moduleId: module.id,
                        moduleTitle: module.title,
                        challengeTitle: module.labChallenge.title,
                      },
                    })
                    navigate(ROUTES.LAB)
                  }}
                >
                  Try this in the Lab
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <div>
                  <p className="label-comment text-primary/75 mb-2">// starter prompt — take it to any Claude session</p>
                  <pre className="whitespace-pre-wrap rounded-md border border-border/60 bg-background/60 p-3 font-mono text-xs leading-relaxed text-foreground/90">
                    {module.labChallenge.starterPrompt}
                  </pre>
                </div>
              )}
            </motion.div>
          )}

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
                  Back to modules
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
                  Pick the next module
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
