import { useQuery } from "@tanstack/react-query"
import { ExternalLink, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchJobs, type JobsResponse } from "@/lib/api"
import { BACKEND_ENABLED } from "@/lib/constants"

interface OpenJobsProps {
  socCode: string
  parishId?: string | null
}

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function OpenJobs({ socCode, parishId = null }: OpenJobsProps) {
  const query = useQuery<JobsResponse>({
    queryKey: ["jobs", socCode, parishId],
    queryFn: () => fetchJobs(socCode, parishId, 6),
    enabled: BACKEND_ENABLED,
    staleTime: 5 * 60 * 1_000,
  })

  if (query.isLoading) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Loading open Louisiana jobs…
        </CardContent>
      </Card>
    )
  }

  if (query.isError || !query.data) return null

  if (query.data.results.length === 0) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          No open postings for <span className="font-mono">{socCode}</span>
          {parishId && <> in <span className="font-medium">{parishId}</span></>}.{" "}
          {query.data.stub && (
            <span className="italic">
              (Star Jobs live integration pending — showing stubbed data.)
            </span>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold">Open Louisiana jobs</h3>
          {query.data.stub && (
            <Badge variant="outline" className="text-[10px] uppercase">
              Stub
            </Badge>
          )}
        </div>
        <ul className="space-y-3">
          {query.data.results.map((job) => (
            <li key={job.postingId}>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-md border border-border px-3 py-2 transition-colors hover:border-primary/40"
              >
                <div className="mb-0.5 flex items-baseline justify-between gap-2">
                  <span className="font-medium group-hover:text-primary">
                    {job.title}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{job.employer}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.city}
                  </span>
                  {job.salaryMin && job.salaryMax && (
                    <span>
                      {USD.format(job.salaryMin)}–{USD.format(job.salaryMax)}
                    </span>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] text-muted-foreground">
          Powered by LWC Star Jobs{" "}
          {query.data.stub && "(stub data until the live integration ships)"}.
        </p>
      </CardContent>
    </Card>
  )
}
