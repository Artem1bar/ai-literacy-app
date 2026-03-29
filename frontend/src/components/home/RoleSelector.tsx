import { GraduationCap, BookOpen, Code, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { USER_ROLES } from "@/data/user-roles"
import { useRole } from "@/hooks/useRole"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/data/types"

const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  student: GraduationCap,
  professor: BookOpen,
  developer: Code,
}

const ROLE_COLORS: Record<UserRole, string> = {
  student: "text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20",
  professor: "text-purple-500 bg-purple-500/10 group-hover:bg-purple-500/20",
  developer: "text-green-500 bg-green-500/10 group-hover:bg-green-500/20",
}

const ROLE_BORDER_ACTIVE: Record<UserRole, string> = {
  student: "border-blue-500 ring-2 ring-blue-500/20",
  professor: "border-purple-500 ring-2 ring-purple-500/20",
  developer: "border-green-500 ring-2 ring-green-500/20",
}

export function RoleSelector() {
  const { role, setRole } = useRole()

  return (
    <section id="roles" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold sm:text-3xl">Who Are You Learning For?</h2>
        <p className="mt-3 text-muted-foreground">
          Choose your role to get a personalised learning path. You can change this anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
        {USER_ROLES.map((roleConfig) => {
          const Icon = ROLE_ICONS[roleConfig.id]
          const isSelected = role === roleConfig.id

          return (
            <button
              key={roleConfig.id}
              onClick={() => setRole(roleConfig.id)}
              className="group text-left"
              aria-pressed={isSelected}
            >
              <Card className={cn(
                "h-full transition-all cursor-pointer hover:shadow-md",
                isSelected
                  ? ROLE_BORDER_ACTIVE[roleConfig.id]
                  : "hover:border-primary/30",
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      "rounded-lg p-2.5 transition-colors",
                      ROLE_COLORS[roleConfig.id],
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && (
                      <CheckCircle className={cn("h-5 w-5",
                        roleConfig.id === "student" && "text-blue-500",
                        roleConfig.id === "professor" && "text-purple-500",
                        roleConfig.id === "developer" && "text-green-500",
                      )} />
                    )}
                  </div>
                  <h3 className="font-semibold">{roleConfig.label}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {roleConfig.description}
                  </p>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>
    </section>
  )
}
