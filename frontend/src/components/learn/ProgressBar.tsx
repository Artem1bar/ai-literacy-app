import { Progress } from "@/components/ui/progress"
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
      <Progress value={value} className="h-1.5" />
    </div>
  )
}
