import { Link, useLocation } from "react-router"
import { Brain, Menu, GraduationCap, BookOpen, Code, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  { label: "Learn", href: ROUTES.LEARN },
  { label: "Prompt Lab", href: ROUTES.LAB },
  { label: "Resources", href: ROUTES.RESOURCES },
  { label: "Profile", href: ROUTES.PROFILE },
]

const ROLE_ICONS = {
  student: GraduationCap,
  professor: BookOpen,
  developer: Code,
}

export function Navbar() {
  const location = useLocation()
  const { role, roleConfig } = useRole()
  const [open, setOpen] = useState(false)

  const RoleIcon = role ? ROLE_ICONS[role] : null

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 font-semibold">
            <Brain className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-md transition-colors",
                  location.pathname === link.href
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Role badge + mobile menu */}
          <div className="flex items-center gap-2">
            {role && roleConfig && (
              <Link to={ROUTES.HOME}>
                <Badge variant="secondary" className="hidden sm:flex items-center gap-1 cursor-pointer">
                  {RoleIcon && <RoleIcon className="h-3 w-3" />}
                  {roleConfig.label}
                </Badge>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {APP_NAME}
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-md transition-colors",
                        location.pathname === link.href
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {role && roleConfig && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="px-3 text-xs text-muted-foreground mb-2">Current role</p>
                      <div className="px-3 flex items-center gap-2 text-sm font-medium">
                        {RoleIcon && <RoleIcon className="h-4 w-4" />}
                        {roleConfig.label}
                      </div>
                    </div>
                  )}
                </nav>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
