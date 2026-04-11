import { Link, useLocation } from "react-router"
import { Brain, Menu, GraduationCap, BookOpen, Code, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { APP_NAME, ROUTES } from "@/lib/constants"
import { useRole } from "@/hooks/useRole"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Learn",      href: ROUTES.LEARN },
  { label: "Prompt Lab", href: ROUTES.LAB },
  { label: "Resources",  href: ROUTES.RESOURCES },
  { label: "Profile",    href: ROUTES.PROFILE },
]

const ROLE_ICONS = {
  student:   GraduationCap,
  professor: BookOpen,
  developer: Code,
}

const ROLE_TOKEN: Record<string, string> = {
  student:   "student",
  professor: "professor",
  developer: "developer",
}

export function Navbar() {
  const location = useLocation()
  const { role, roleConfig } = useRole()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const RoleIcon = role ? ROLE_ICONS[role] : null

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md transition-shadow duration-200",
      scrolled && "shadow-[0_1px_0_hsl(var(--border))]",
    )}>
      {/* Top edge glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex h-13 items-center justify-between">

          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 group"
            aria-label="AI Literacy home"
          >
            <div className="rounded border border-border/60 p-1.5 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <span className="font-mono-data text-sm font-medium text-foreground hidden sm:inline tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href
                || location.pathname.startsWith(link.href + "/")
              return (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      "block px-3 py-1.5 text-sm rounded transition-colors",
                      active
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Role token + mobile menu */}
          <div className="flex items-center gap-2">
            {role && roleConfig && RoleIcon && (
              <Link to={ROUTES.HOME}>
                <span className="hidden sm:flex items-center gap-1.5 font-mono-data text-xs px-2 py-1 rounded border border-border/60 text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
                  [{ROLE_TOKEN[role]}]
                </span>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-60 bg-background border-border/60">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span className="font-mono-data text-sm">{APP_NAME}</span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="mt-6 flex flex-col gap-0.5">
                  {NAV_LINKS.map((link) => {
                    const active = location.pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "px-3 py-2 text-sm rounded transition-colors",
                          active
                            ? "text-foreground bg-accent font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                        )}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>

                {role && roleConfig && (
                  <div className="mt-6 pt-4 border-t border-border/60">
                    <p className="px-3 label-comment mb-2">// current role</p>
                    <div className="px-3">
                      <span className="font-mono-data text-xs text-primary border border-primary/20 bg-primary/5 rounded px-2 py-1">
                        [{ROLE_TOKEN[role]}]
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 h-7 w-7"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
