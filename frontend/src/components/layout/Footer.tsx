import { APP_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. Built with Claude Sonnet 4.6.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a
              href="https://docs.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Anthropic Docs
            </a>
            <a
              href="https://ailiteracyframework.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              AILit Framework
            </a>
            <a
              href="https://github.com/anthropics/prompt-eng-interactive-tutorial"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Prompt Tutorial
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
