import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  label?: string
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, label, className, showLabel = true }: ProgressBarProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {label && <span>{label}</span>}
          <span>{value}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </div>
  )
}
