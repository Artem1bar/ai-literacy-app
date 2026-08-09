import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <Brain className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-6xl font-bold text-muted-foreground/30 mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Nothing to see at this URL</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-sm leading-relaxed">
        The page you tried doesn't exist — or doesn't exist yet. Either way, the useful stuff is
        one click away.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link to="/">Back to the homepage</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/learn">See the modules</Link>
        </Button>
      </div>
    </div>
  )
}
