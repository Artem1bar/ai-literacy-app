import { useRef } from "react"
import { useInView } from "framer-motion"
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Map,
  FlaskConical,
  BookOpenCheck,
  ArrowRight,
} from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { BACKEND_ENABLED, ROUTES } from "@/lib/constants"

const WHY_ITEMS = [
  {
    icon: TrendingUp,
    stat: "01",
    title: "The skill is compounding",
    description:
      "People who prompt, verify, and supervise AI well pull away from people who don't. Worth practising deliberately.",
  },
  {
    icon: Users,
    stat: "02",
    title: "Generic advice ages badly",
    description:
      "\"Be specific. Ask step by step.\" You've read this. The useful material is role-specific and failure-aware.",
  },
  {
    icon: ShieldCheck,
    stat: "03",
    title: "Failure modes aren't obvious",
    description:
      "Confident wrong answers. Hallucinated citations. Quiet bias. Half the job is spotting them in time.",
  },
]

const HOW_STEPS = [
  {
    index: "01",
    title: "Pick a role",
    description:
      "Student, educator, or developer. The curriculum reshuffles itself around your work.",
    icon: Map,
  },
  {
    index: "02",
    title: "Read, then try it",
    description:
      BACKEND_ENABLED
        ? "Every module ends with a challenge that opens pre-seeded in the Prompt Lab."
        : "Every module ends with a hands-on challenge and a starter prompt for your own Claude session.",
    icon: FlaskConical,
  },
  {
    index: "03",
    title: "Come back for review",
    description:
      "Spaced repetition resurfaces the questions you missed. Like medical students use for anatomy.",
    icon: BookOpenCheck,
  },
]

const WHAT_ITEMS = [
  { value: "30", label: "Learning Modules" },
  { value: "15", label: "Prompt Templates" },
  { value: "03", label: "Frameworks" },
  { value: "40+", label: "Curated Resources" },
]

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function SectionLabel({ comment }: { comment: string }) {
  return (
    <p className="label-comment text-primary mb-5">{comment}</p>
  )
}

export function LearningJourney() {
  return (
    <div>
      {/* ── WHY ─────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <Reveal>
            <SectionLabel comment="// why this curriculum exists" />
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem] max-w-2xl leading-tight">
              Most AI advice is marketing or panic.{" "}
              <span className="text-muted-foreground font-normal">This is neither.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Use AI the way a good colleague does — clear eyes about what it does well, and what it gets wrong.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px sm:grid-cols-3 border border-border rounded-lg overflow-hidden">
            {WHY_ITEMS.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={i * 80} className="bg-card p-8 group">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-md border border-border p-2.5 group-hover:border-primary/40 transition-colors">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className="font-mono-data text-2xl text-primary mb-2">{item.stat}</div>
                      <h3 className="text-lg font-semibold mb-2 leading-tight">{item.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HOW ─────────────────────────────────────────────── */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <Reveal>
            <SectionLabel comment="// how it works" />
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem] max-w-2xl leading-tight">
              Pick a path. Read a module.{" "}
              <span className="text-muted-foreground font-normal">Try it on Claude in the same tab.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {HOW_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <Reveal key={step.index} delay={i * 100}>
                  <div className="group flex flex-col gap-5 p-7 rounded-lg border border-border hover:border-primary/40 transition-colors bg-background/40">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-data text-sm text-primary">{step.index}</span>
                      <div className="h-px flex-1 bg-border" />
                      <div className="rounded-md border border-border p-2 group-hover:border-primary/40 transition-colors">
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 leading-tight">{step.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT ─────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <Reveal>
            <SectionLabel comment="// what's in the box" />
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem] max-w-2xl leading-tight">
              Thirty modules, built to be used —{" "}
              <span className="text-muted-foreground font-normal">not just read.</span>
            </h2>
          </Reveal>

          {/* Stats grid — monospace terminal feel */}
          <div className="mt-14 grid grid-cols-2 gap-px sm:grid-cols-4 border border-border rounded-lg overflow-hidden">
            {WHAT_ITEMS.map((item, i) => (
              <Reveal key={item.label} delay={i * 60} className="bg-card p-8 text-center">
                <div className="font-mono-data text-4xl font-medium text-primary mb-2">{item.value}</div>
                <div className="label-comment">{item.label}</div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4" delay={200}>
            <Button asChild size="lg" className="gap-2 group h-12 px-6 text-base">
              <Link to={ROUTES.LEARN}>
                Open the first module
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <span className="label-comment">free · no signup · no email capture</span>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
