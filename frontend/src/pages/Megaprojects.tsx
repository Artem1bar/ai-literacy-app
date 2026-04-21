import { Factory } from "lucide-react"
import { MegaprojectCard } from "@/components/megaprojects/MegaprojectCard"
import { MEGAPROJECTS } from "@/data/megaprojects"

export default function Megaprojects() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-2 flex items-center gap-2">
        <Factory className="h-5 w-5 text-primary" />
        <h1 className="text-3xl font-bold">Louisiana Megaprojects</h1>
      </div>
      <p className="mb-8 max-w-3xl text-muted-foreground">
        The five named anchor investments reshaping Louisiana's AI-era labor market.
        Each card links into the occupations most directly affected — pick your path
        toward that employer.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {MEGAPROJECTS.map((m) => (
          <MegaprojectCard key={m.id} megaproject={m} />
        ))}
      </div>
    </div>
  )
}
