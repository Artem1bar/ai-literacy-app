import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"
import { useRole } from "@/hooks/useRole"

const STATS = [
  { value: "30", label: "modules" },
  { value: "15", label: "templates" },
  { value: "03", label: "frameworks" },
  { value: "live", label: "Claude API" },
]

export function HeroSection() {
  const { role } = useRole()

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Indigo top-edge line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      {/* Ambient glow — fixed, never flickers */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[500px] rounded-full bg-primary/6 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36 lg:px-8">
        {/* Comment label — CSS animation, visible immediately */}
        <p className="label-comment text-primary mb-6 animate-fade-in">
          // thirty modules · three paths · live Claude API
        </p>

        {/* Headline */}
        <h1 className="max-w-3xl text-[3rem] font-bold tracking-tight leading-[1.05] sm:text-[3.75rem] lg:text-[4.25rem] animate-slide-up">
          Learn to use AI{" "}
          <span className="text-primary">like it matters.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-lg text-foreground/80 leading-relaxed sm:text-xl animate-slide-up delay-100">
          Thirty modules on prompt engineering and responsible AI.
          Every one pairs with a live Claude Sonnet 4.6 lab.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3 animate-slide-up delay-200">
          <Button asChild size="lg" className="gap-2 group h-12 px-6 text-base">
            <Link to={role ? ROUTES.LEARN : ROUTES.HOME + "#roles"}>
              {role ? "Continue learning" : "Pick your path"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-6 text-base border-border hover:border-primary/50"
          >
            <Link to={ROUTES.LAB}>Open the Prompt Lab</Link>
          </Button>
        </div>

        {/* Stats — monospace terminal row */}
        <div className="mt-14 flex items-center gap-10 flex-wrap animate-fade-in delay-300">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-mono-data text-2xl font-medium text-foreground leading-none">
                {stat.value}
              </span>
              <span className="label-comment">{stat.label}</span>
            </div>
          ))}
          <div className="h-10 w-px bg-border mx-2 hidden sm:block" />
          <span className="label-comment text-muted-foreground/75 hidden sm:block">
            OECD · Stanford · Anthropic
          </span>
        </div>
      </div>
    </section>
  )
}
