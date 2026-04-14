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
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="label-comment text-primary mb-5">// tell us who you are</p>
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem] leading-tight">
            What are you using AI for?{" "}
            <span className="text-muted-foreground font-normal">
              We'll order the modules.
            </span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            No signup. Switch roles anytime.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl">
          {USER_ROLES.map((roleConfig, i) => {
            const Icon = ROLE_ICONS[roleConfig.id]
            const isSelected = role === roleConfig.id

            return (
              <motion.button
                key={roleConfig.id}
                onClick={() => setRole(roleConfig.id)}
                aria-pressed={isSelected}
                className={cn(
                  "group relative text-left rounded-lg border p-6 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isSelected
                    ? "border-primary/50 bg-primary/5"
                    : "border-border bg-background hover:border-primary/30 hover:bg-card/60",
                )}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileTap={{ scale: 0.985 }}
              >
                {/* Left accent bar when selected */}
                <div className={cn(
                  "absolute left-0 top-4 bottom-4 w-0.5 rounded-r transition-all duration-200",
                  isSelected ? "bg-primary" : "bg-transparent group-hover:bg-primary/30",
                )} />

                <div className="flex items-start justify-between mb-4">
                  {/* Token badge */}
                  <span className={cn(
                    "font-mono-data text-sm px-2.5 py-1 rounded border transition-colors",
                    isSelected
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground group-hover:border-primary/30",
                  )}>
                    [{ROLE_TOKEN[roleConfig.id]}]
                  </span>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Check className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )} />
                  <h3 className="text-lg font-semibold">{roleConfig.label.split(" /")[0]}</h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
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
