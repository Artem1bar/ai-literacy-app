import { useRef } from "react"
import { useInView } from "framer-motion"
import { FlaskConical, BookOpenCheck, Zap, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"
import { ROUTES } from "@/lib/constants"

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Research, not repackaged hype",
    description:
      "Every module traces back to primary sources — the OECD/EU AILit framework, Stanford's GenAI literacy work, and Anthropic's own documentation. If we can't point at the paper, we don't make the claim.",
    link: ROUTES.LEARN,
    linkLabel: "Browse modules",
  },
  {
    icon: FlaskConical,
    title: "A lab, not a lecture",
    description:
      "Fifteen templates, three prompt frameworks, and a direct line to Claude Sonnet 4.6. Every module ships with a challenge you can run the moment you finish reading — no context switching, no copy-paste tax.",
    link: ROUTES.LAB,
    linkLabel: "Open the lab",
  },
  {
    icon: Zap,
    title: "Shaped around your work",
    description:
      "Students, educators, and developers don't need the same things from AI. Pick a path and the curriculum rearranges itself — the modules that matter for your work move up, the rest stay one click away.",
    link: ROUTES.RESOURCES,
    linkLabel: "See resources",
  },
]

function Card({ feature, index }: { feature: (typeof FEATURES)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20px" })
  const Icon = feature.icon

  return (
    <div
      ref={ref}
      className="group relative flex flex-col gap-5 p-6 border-r border-border last:border-r-0 max-sm:border-r-0 max-sm:border-b last:max-sm:border-b-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${index * 90}ms, transform 0.5s ease ${index * 90}ms`,
      }}
    >
      {/* Icon */}
      <div className="flex items-center justify-between">
        <div className="rounded border border-border p-2 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-150">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-150" />
        </div>
        <Link
          to={feature.link}
          className="flex items-center gap-0.5 label-comment text-muted-foreground/35 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
        >
          {feature.linkLabel}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-sm font-semibold mb-2">{feature.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-6 right-6 h-px bg-primary/0 group-hover:bg-primary/15 transition-colors duration-200" />
    </div>
  )
}

export function ValueProposition() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 divide-border">
          {FEATURES.map((feature, i) => (
            <Card key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
