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
import { ROUTES } from "@/lib/constants"

const WHY_ITEMS = [
  {
    icon: TrendingUp,
    stat: "01",
    title: "The skill is compounding",
    description:
      "People who learn to prompt, verify, and supervise AI well pull away from people who don't — not by a little, and not slowly. This is a skill worth being deliberate about.",
  },
  {
    icon: Users,
    stat: "02",
    title: "Generic advice ages badly",
    description:
      "\"Be specific. Ask step by step.\" You've read this already. The useful material is role-specific, failure-aware, and tested against a real model — which is the bar this curriculum is trying to meet.",
  },
  {
    icon: ShieldCheck,
    stat: "03",
    title: "The failure modes are not obvious",
    description:
      "Confident-sounding wrong answers. Hallucinated citations. Quiet bias. Context that drifts mid-conversation. Half the job is learning to smell these before they cost you something.",
  },
]

const HOW_STEPS = [
  {
    index: "01",
    title: "Pick a role",
    description:
      "Student, educator, or developer. The curriculum reshuffles itself around what you actually do — and you can switch any time without losing progress.",
    icon: Map,
  },
  {
    index: "02",
    title: "Read, then try it",
    description:
      "Every module ends with a challenge that opens pre-seeded in the Prompt Lab. You run it against Claude Sonnet 4.6 and see the output before the ideas have a chance to fade.",
    icon: FlaskConical,
  },
  {
    index: "03",
    title: "Come back for review",
    description:
      "Your progress and quiz history live on the profile page. Questions you've missed resurface later via spaced repetition — the same technique medical students use to remember anatomy.",
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
    <p className="label-comment text-primary/75 mb-5">{comment}</p>
  )
}

export function LearningJourney() {
  return (
    <div>
      {/* ── WHY ─────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <Reveal>
            <SectionLabel comment="// why this curriculum exists" />
            <h2 className="text-2xl font-bold sm:text-3xl max-w-lg">
              Most AI advice is either marketing or panic.{" "}
              <span className="text-muted-foreground font-normal">This is neither.</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl leading-relaxed">
              The goal is to help you use AI the way a good colleague uses it: with clear eyes
              about what it does well, a short list of things it tends to get wrong, and enough
              judgement to know which one you're looking at.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-px sm:grid-cols-3 border border-border rounded-lg overflow-hidden">
            {WHY_ITEMS.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={i * 80} className="bg-card p-6 group">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-md border border-border p-2 group-hover:border-primary/30 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className="font-mono-data text-xl text-primary mb-1">{item.stat}</div>
                      <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
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
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <Reveal>
            <SectionLabel comment="// how it works" />
            <h2 className="text-2xl font-bold sm:text-3xl max-w-lg">
              Pick a path, read a module,{" "}
              <span className="text-muted-foreground font-normal">try it on Claude in the same tab.</span>
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {HOW_STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <Reveal key={step.index} delay={i * 100}>
                  <div className="group flex flex-col gap-4 p-5 rounded-lg border border-border hover:border-primary/25 transition-colors bg-background/40">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-data text-xs text-primary/75">{step.index}</span>
                      <div className="h-px flex-1 bg-border" />
                      <div className="rounded border border-border p-1.5 group-hover:border-primary/30 transition-colors">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1.5">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
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
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <Reveal>
            <SectionLabel comment="// what's in the box" />
            <h2 className="text-2xl font-bold sm:text-3xl max-w-lg">
              Thirty modules, built to be used —{" "}
              <span className="text-muted-foreground font-normal">not just read.</span>
            </h2>
          </Reveal>

          {/* Stats grid — monospace terminal feel */}
          <div className="mt-10 grid grid-cols-2 gap-px sm:grid-cols-4 border border-border rounded-lg overflow-hidden">
            {WHAT_ITEMS.map((item, i) => (
              <Reveal key={item.label} delay={i * 60} className="bg-card p-6 text-center">
                <div className="font-mono-data text-3xl font-medium text-primary mb-1">{item.value}</div>
                <div className="label-comment">{item.label}</div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4" delay={200}>
            <Button asChild size="lg" className="gap-2 group">
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
