import { GraduationCap, BookOpen, Code, Check } from "lucide-react"
import { motion } from "framer-motion"
import { USER_ROLES } from "@/data/user-roles"
import { useRole } from "@/hooks/useRole"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/data/types"

const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  student: GraduationCap,
  professor: BookOpen,
  developer: Code,
}

// Terminal-style bracket tokens per role
const ROLE_TOKEN: Record<UserRole, string> = {
  student:   "student",
  professor: "professor",
  developer: "developer",
}

export function RoleSelector() {
  const { role, setRole } = useRole()

  return (
    <section id="roles" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="label-comment text-primary/75 mb-5">// tell us who you are</p>
          <h2 className="text-2xl font-bold sm:text-3xl">
            What are you using AI for?{" "}
            <span className="text-muted-foreground font-normal">
              We'll order the modules accordingly.
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No signup, no commitment — you can switch roles anytime from the profile page.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-2xl">
          {USER_ROLES.map((roleConfig, i) => {
            const Icon = ROLE_ICONS[roleConfig.id]
            const isSelected = role === roleConfig.id

            return (
              <motion.button
                key={roleConfig.id}
                onClick={() => setRole(roleConfig.id)}
                aria-pressed={isSelected}
                className={cn(
                  "group relative text-left rounded-lg border p-4 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-background hover:border-primary/20 hover:bg-card/60",
                )}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileTap={{ scale: 0.985 }}
              >
                {/* Left accent bar when selected */}
                <div className={cn(
                  "absolute left-0 top-3 bottom-3 w-0.5 rounded-r transition-all duration-200",
                  isSelected ? "bg-primary" : "bg-transparent group-hover:bg-primary/20",
                )} />

                <div className="flex items-start justify-between mb-3">
                  {/* Token badge */}
                  <span className={cn(
                    "font-mono-data text-xs px-2 py-0.5 rounded border transition-colors",
                    isSelected
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground group-hover:border-primary/20",
                  )}>
                    [{ROLE_TOKEN[roleConfig.id]}]
                  </span>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Icon className={cn(
                    "h-4 w-4 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )} />
                  <h3 className="text-sm font-semibold">{roleConfig.label.split(" /")[0]}</h3>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pl-0.5">
                  {roleConfig.description}
                </p>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
