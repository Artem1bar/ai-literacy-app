import { FlaskConical, BookOpenCheck, Zap } from "lucide-react"

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: "Research-Backed Curriculum",
    description:
      "Content grounded in OECD/EU AILit Framework, Stanford GenAI Literacy, and official Anthropic documentation. Every claim sourced.",
  },
  {
    icon: FlaskConical,
    title: "Interactive Prompt Lab",
    description:
      "15 templates, 3 frameworks (CO-STAR, RISEN, Chain-of-Thought), and live Claude Sonnet 4.6 API calls — learn by doing, not just reading.",
  },
  {
    icon: Zap,
    title: "Role-Adaptive Paths",
    description:
      "Separate learning paths for students, educators, and developers. Content filtered to what matters most for your work.",
  },
]

export function ValueProposition() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
