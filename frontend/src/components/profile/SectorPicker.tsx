import { Briefcase } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SECTORS } from "@/data/louisiana"
import type { SectorId } from "@/data/types"

interface SectorPickerProps {
  value: SectorId | null
  onChange: (sectorId: SectorId | null) => void
  className?: string
}

const NULL_VALUE = "__none__"

export function SectorPicker({ value, onChange, className }: SectorPickerProps) {
  return (
    <div className={className}>
      <Select
        value={value ?? NULL_VALUE}
        onValueChange={(v) => onChange(v === NULL_VALUE ? null : (v as SectorId))}
      >
        <SelectTrigger aria-label="Select industry sector">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <SelectValue placeholder="Select your industry sector…" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NULL_VALUE}>
            <span className="text-muted-foreground">No sector selected</span>
          </SelectItem>
          {SECTORS.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
