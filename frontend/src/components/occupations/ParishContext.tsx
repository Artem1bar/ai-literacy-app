import { Link } from "react-router"
import { MapPin, Factory, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  RLMAS,
  employersInParish,
  employersInRLMA,
  parishById,
} from "@/data/louisiana"
import { megaprojectsForRLMA } from "@/data/megaprojects"

interface ParishContextProps {
  parishId: string | null
  rlmaId: string | null
  socCode: string
}

export function ParishContext({ parishId, rlmaId, socCode }: ParishContextProps) {
  if (!parishId && !rlmaId) return null

  const parish = parishId ? parishById(parishId) : null
  const rlma = rlmaId ? RLMAS.find((r) => r.id === rlmaId) : null
  const localEmployers = parishId
    ? employersInParish(parishId)
    : rlmaId
      ? employersInRLMA(rlmaId)
      : []
  const regionalMegaprojects = rlmaId
    ? megaprojectsForRLMA(rlmaId as typeof RLMAS[number]["id"])
    : []

  if (localEmployers.length === 0 && regionalMegaprojects.length === 0) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          <MapPin className="mb-2 h-4 w-4" />
          We don't yet have local employer data for{" "}
          <span className="font-medium">{parish?.name ?? rlma?.name}</span>. Check
          back as we expand coverage.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {parish ? `In ${parish.name} Parish` : `In ${rlma?.name}`}
          {rlma && parish && (
            <>
              <span>·</span>
              <span>{rlma.name}</span>
            </>
          )}
        </div>

        {localEmployers.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Users className="h-3.5 w-3.5" /> Local employers hiring this role
            </h3>
            <ul className="space-y-1.5">
              {localEmployers.slice(0, 6).map((e) => (
                <li key={e.id} className="flex items-center gap-2 text-sm">
                  <span>{e.name}</span>
                  {e.isMegaproject && (
                    <Badge variant="outline" className="text-[10px]">
                      Megaproject
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {regionalMegaprojects.length > 0 && (
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Factory className="h-3.5 w-3.5" /> Regional megaprojects
            </h3>
            <ul className="space-y-1.5">
              {regionalMegaprojects.map((m) => {
                const alignsWithSOC = m.primarySOCs.includes(socCode)
                return (
                  <li key={m.id}>
                    <Link
                      to="/megaprojects"
                      className="inline-flex items-center gap-2 text-sm hover:text-primary"
                    >
                      <span>{m.name}</span>
                      {alignsWithSOC && (
                        <Badge className="text-[10px]" variant="default">
                          Relevant
                        </Badge>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
