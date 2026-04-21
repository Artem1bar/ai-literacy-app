import { Building2, Star } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EMPLOYERS } from "@/data/louisiana"
import type { SectorId } from "@/data/types"

interface EmployerPickerProps {
  value: string | null
  onChange: (employerId: string | null) => void
  /** Optional parish filter — restricts choices to employers present in the parish. */
  parishId?: string | null
  /** Optional sector filter — restricts choices to the selected sector. */
  sectorId?: SectorId | null
  className?: string
}

const NULL_VALUE = "__none__"

export function EmployerPicker({
  value,
  onChange,
  parishId,
  sectorId,
  className,
}: EmployerPickerProps) {
  const candidates = EMPLOYERS.filter((e) => {
    if (parishId && !e.parishIds.includes(parishId)) return false
    if (sectorId && e.sector !== sectorId) return false
    return true
  })

  return (
    <div className={className}>
      <Select
        value={value ?? NULL_VALUE}
        onValueChange={(v) => onChange(v === NULL_VALUE ? null : v)}
      >
        <SelectTrigger aria-label="Select employer">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <SelectValue
              placeholder={
                candidates.length === 0
                  ? "No employers match your filters"
                  : "Select your employer (optional)…"
              }
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NULL_VALUE}>
            <span className="text-muted-foreground">No employer selected</span>
          </SelectItem>
          {candidates.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              <div className="flex items-center gap-2">
                <span>{e.name}</span>
                {e.isMegaproject && (
                  <Star
                    className="h-3 w-3 text-amber-500"
                    aria-label="Megaproject"
                  />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {candidates.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          <Star className="mr-1 inline h-3 w-3 text-amber-500" aria-hidden /> denotes
          megaproject-adjacent employers.
        </p>
      )}
    </div>
  )
}
