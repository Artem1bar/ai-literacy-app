import { useRef } from "react"
import { useInView } from "framer-motion"
import { FlaskConical, BookOpenCheck, Zap, ArrowUpRight } from "lucide-react"
import { Link } from "react-router"
import { BACKEND_ENABLED, ROUTES } from "@/lib/constants"

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Research, not hype",
    description:
      "Every claim traces back to OECD, Stanford, or Anthropic source material.",
    link: ROUTES.LEARN,
    linkLabel: "Browse modules",
  },
  BACKEND_ENABLED
    ? {
        icon: FlaskConical,
        title: "A lab, not a lecture",
        description:
          "Every module ends with a challenge you can run on Claude Sonnet 4.6 in one click.",
        link: ROUTES.LAB,
        linkLabel: "Open the lab",
      }
    : {
        icon: FlaskConical,
        title: "Practice, not just reading",
        description:
          "Every module ends with a hands-on challenge and a starter prompt you can take to any Claude session.",
        link: ROUTES.LEARN,
        linkLabel: "Browse modules",
      },
  {
    icon: Zap,
    title: "Shaped around your work",
    description:
      "Student, educator, or developer — the curriculum rearranges itself around your role.",
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
      className="group relative flex flex-col gap-6 p-8 border-r border-border last:border-r-0 max-sm:border-r-0 max-sm:border-b last:max-sm:border-b-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${index * 90}ms, transform 0.5s ease ${index * 90}ms`,
      }}
    >
      {/* Icon */}
      <div className="flex items-center justify-between">
        <div className="rounded-md border border-border p-2.5 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-150">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-150" />
        </div>
        <Link
          to={feature.link}
          className="flex items-center gap-1 label-comment text-muted-foreground/70 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
        >
          {feature.linkLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Text */}
      <div>
        <h3 className="text-xl font-semibold mb-3 leading-tight">{feature.title}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-8 right-8 h-px bg-primary/0 group-hover:bg-primary/25 transition-colors duration-200" />
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
