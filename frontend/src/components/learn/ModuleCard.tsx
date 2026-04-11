import { Link } from "react-router"
import {
  Brain, MessageSquare, Sparkles, Shield, Workflow, Clock,
  Database, BookOpen, ShieldCheck, MessagesSquare,
  Lightbulb, Layers, UserCog, ShieldAlert, PenTool, GraduationCap,
  Bug, GitPullRequest, BarChart3, FileText, FileSearch, Wrench,
  Search, Bot, Feather, Languages, Calculator, ClipboardList,
  Gauge, Target, BadgeCheck,
} from "lucide-react"
import { motion } from "framer-motion"
import { useProgressStore } from "@/store/progressStore"
import { cn } from "@/lib/utils"
import type { Module } from "@/data/types"

const MODULE_ICONS: Record<string, React.ElementType> = {
  Brain,
  MessageSquare,
  Sparkles,
  Shield,
  Workflow,
  Database,
  BookOpen,
  ShieldCheck,
  MessagesSquare,
  Lightbulb,
  Layers,
  UserCog,
  ShieldAlert,
  PenTool,
  GraduationCap,
  Bug,
  GitPullRequest,
  BarChart3,
  FileText,
  FileSearch,
  Wrench,
  Search,
  Bot,
  Feather,
  Languages,
  Calculator,
  ClipboardList,
  Gauge,
  Target,
  BadgeCheck,
}

const ROLE_COLORS: Record<string, string> = {
  student:   "text-blue-400/60",
  professor: "text-violet-400/60",
  developer: "text-emerald-400/60",
}

interface ModuleCardProps {
  module: Module
  compact?: boolean
}

export function ModuleCard({ module, compact = false }: ModuleCardProps) {
  const getModuleProgress = useProgressStore((s) => s.getModuleProgress)
  const progress = getModuleProgress(module.id, module.sections.length)
  const Icon = MODULE_ICONS[module.icon] ?? Brain
  const isComplete = progress === 100

  return (
    <Link to={`/learn/${module.slug}`} className="block h-full group">
      <motion.div
        whileHover={compact ? {} : { y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className={cn(
          "relative h-full rounded-lg border transition-colors duration-150",
          compact
            ? "border-transparent hover:border-border hover:bg-card/60 p-3"
            : "border-border bg-card hover:border-primary/30 p-5",
          isComplete && !compact && "border-primary/25",
        )}
      >
        {/* Left accent bar */}
        {!compact && (
          <div className={cn(
            "absolute left-0 top-4 bottom-4 w-0.5 rounded-r transition-colors duration-150",
            isComplete ? "bg-primary/50" : "bg-transparent group-hover:bg-primary/25",
          )} />
        )}

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "rounded border p-1.5 transition-colors duration-150",
              isComplete
                ? "border-primary/25 bg-primary/8"
                : "border-border group-hover:border-primary/25",
            )}>
              <Icon className={cn(
                "h-3.5 w-3.5 transition-colors duration-150",
                isComplete ? "text-primary" : "text-muted-foreground group-hover:text-primary",
              )} />
            </div>
            <div>
              <h3 className={cn(
                "font-semibold leading-tight text-foreground",
                compact ? "text-sm" : "text-[14px]",
              )}>
                {module.title}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="h-2.5 w-2.5 text-muted-foreground/50" />
                <span className="font-mono-data text-[10px] text-muted-foreground/50">
                  {module.estimatedMinutes}m
                </span>
                {isComplete && (
                  <span className="font-mono-data text-[10px] text-primary/70 ml-0.5">
                    · complete
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {!compact && (
          <>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
              {module.description}
            </p>

            {/* Progress */}
            <div className="mb-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="label-comment">progress</span>
                <span className="font-mono-data text-[10px] text-muted-foreground/70">
                  {progress}%
                </span>
              </div>
              {/* 2px bar — thick enough to read, thin enough to be precise */}
              <div className="h-[2px] bg-border rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    isComplete ? "bg-primary" : "bg-primary/50",
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
            </div>

            {/* Role tokens */}
            <div className="flex flex-wrap gap-1">
              {module.roles.map((role) => (
                <span
                  key={role}
                  className={cn(
                    "font-mono-data text-[10px] px-1.5 py-0.5 rounded border border-border/40",
                    ROLE_COLORS[role] ?? "text-muted-foreground/40",
                  )}
                >
                  [{role}]
                </span>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </Link>
  )
}
