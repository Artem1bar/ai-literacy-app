import { useState } from "react"
import { MapPin, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PARISHES, RLMAS, parishById } from "@/data/louisiana"
import { cn } from "@/lib/utils"

interface ParishPickerProps {
  value: string | null
  onChange: (parishId: string | null) => void
  className?: string
}

export function ParishPicker({ value, onChange, className }: ParishPickerProps) {
  const [open, setOpen] = useState(false)
  const parish = value ? parishById(value) : null
  const rlma = parish ? RLMAS.find((r) => r.id === parish.rlma) : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("h-auto min-h-10 w-full justify-between text-left", className)}
          aria-label="Select Louisiana parish"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            {parish ? (
              <div className="flex flex-col items-start">
                <span className="font-medium">{parish.name} Parish</span>
                {rlma && (
                  <span className="text-xs text-muted-foreground">{rlma.name}</span>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">Select your parish…</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Your Louisiana parish</DialogTitle>
          <DialogDescription>
            Parishes are grouped by Louisiana Workforce Commission Regional Labor Market
            Area (RLMA). Pick yours to see local employers and megaprojects.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[480px] pr-3">
          <div className="space-y-4">
            {RLMAS.map((region) => {
              const parishes = PARISHES.filter((p) => p.rlma === region.id)
              return (
                <div key={region.id}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <h3 className="text-sm font-semibold">{region.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {parishes.length} parishes
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Anchor: {region.anchorProject}
                  </p>
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                    {parishes.map((p) => {
                      const selected = p.id === value
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onChange(p.id)
                            setOpen(false)
                          }}
                          aria-pressed={selected}
                          className={cn(
                            "rounded-md border px-2 py-1.5 text-left text-xs transition-colors",
                            selected
                              ? "border-primary bg-primary/10 font-medium"
                              : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
                          )}
                        >
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        {value && (
          <div className="flex justify-end pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
            >
              Clear selection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
