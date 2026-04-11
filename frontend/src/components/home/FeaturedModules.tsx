import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { ModuleCard } from "@/components/learn/ModuleCard"
import { MODULES } from "@/data/modules"
import { useRole } from "@/hooks/useRole"
import { ROUTES } from "@/lib/constants"

export function FeaturedModules() {
  const { role } = useRole()

  const featured = role
    ? MODULES.filter((m) => m.roles.includes(role)).slice(0, 3)
    : MODULES.slice(0, 3)

  return (
    <section className="border-t border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <motion.div
          className="flex items-end justify-between mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <p className="label-comment text-primary/75 mb-2">
              {role ? `// queued up for you` : "// start here"}
            </p>
            <h2 className="text-xl font-bold">
              {role
                ? role === "student"
                  ? "Where students tend to begin"
                  : role === "professor"
                    ? "Where educators tend to begin"
                    : "Where developers tend to begin"
                : "Three modules to start with"}
            </h2>
          </div>

          <Link
            to={ROUTES.LEARN}
            className="hidden sm:flex items-center gap-1 label-comment text-muted-foreground/50 hover:text-primary transition-colors group"
          >
            see all thirty
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {featured.map((module) => (
            <motion.div
              key={module.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
              }}
            >
              <ModuleCard module={module} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-5 sm:hidden">
          <Link
            to={ROUTES.LEARN}
            className="flex items-center gap-1 label-comment text-muted-foreground/50 hover:text-primary transition-colors group w-fit"
          >
            see all thirty modules
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
