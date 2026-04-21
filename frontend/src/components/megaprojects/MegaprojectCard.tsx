import { Link } from "react-router"
import { Factory, MapPin, Users, DollarSign, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RLMAS } from "@/data/louisiana"
import type { Megaproject } from "@/data/megaprojects"

interface MegaprojectCardProps {
  megaproject: Megaproject
}

const USD_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})

const JOB_FORMAT = new Intl.NumberFormat("en-US", { notation: "compact" })

export function MegaprojectCard({ megaproject }: MegaprojectCardProps) {
  const rlma = RLMAS.find((r) => r.id === megaproject.rlma)
  const primarySOC = megaproject.primarySOCs[0]

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Factory className="h-3.5 w-3.5" />
              <span>{megaproject.owner}</span>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                {megaproject.status.replace("-", " ")}
              </Badge>
            </div>
            <h3 className="mt-1 font-semibold">{megaproject.name}</h3>
          </div>
          <Badge variant="secondary" className="whitespace-nowrap text-xs">
            {megaproject.announcementYear}
          </Badge>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">{megaproject.description}</p>

        <dl className="mb-4 grid grid-cols-3 gap-2 text-xs">
          <div>
            <dt className="text-muted-foreground">Investment</dt>
            <dd className="flex items-center gap-1 font-medium">
              <DollarSign className="h-3 w-3" />
              {USD_FORMAT.format(megaproject.investmentUSD)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Direct jobs</dt>
            <dd className="flex items-center gap-1 font-medium">
              <Users className="h-3 w-3" />
              {JOB_FORMAT.format(megaproject.projectedJobs)}+
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Region</dt>
            <dd className="flex items-center gap-1 font-medium">
              <MapPin className="h-3 w-3" />
              {rlma?.name.replace(" Region", "") ?? megaproject.rlma}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-2">
          {primarySOC && (
            <Button variant="outline" size="sm" asChild>
              <Link
                to={`/occupations/${encodeURIComponent(primarySOC)}`}
                className="gap-1"
              >
                Prepare for this employer
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          )}
          {megaproject.announcementUrl && (
            <a
              href={megaproject.announcementUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              LED announcement →
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
