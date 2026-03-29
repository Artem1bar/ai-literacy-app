import { Link } from "react-router"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/lib/constants"
import { useRole } from "@/hooks/useRole"

export function HeroSection() {
  const { role } = useRole()

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4 inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Grounded in OECD, Stanford & Anthropic research
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Master AI Literacy.{" "}
            <span className="text-primary">Actually Use It.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            A research-backed, role-adaptive learning platform for prompt engineering,
            Claude workflows, and responsible AI — built for students, educators, and developers.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to={role ? ROUTES.LEARN : ROUTES.HOME + "#roles"}>
                {role ? "Continue Learning" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={ROUTES.LAB}>Try Prompt Lab</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>5 learning modules</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>15 prompt templates</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>Live Claude API integration</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>3 role-based paths</span>
          </div>
        </div>
      </div>
    </section>
  )
}
