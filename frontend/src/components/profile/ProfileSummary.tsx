import { Link } from "react-router"
import {
  GraduationCap,
  BookOpen,
  Code,
  HardHat,
  MapPin,
  Briefcase,
  Building2,
  Pencil,
  Star,
  ClipboardCheck,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOccupation } from "@/hooks/useOccupation"
import { useProfile } from "@/hooks/useProfile"
import { SECTORS } from "@/data/louisiana"
import { USER_ROLES } from "@/data/user-roles"
import type { UserRole } from "@/data/types"
import { cn } from "@/lib/utils"
import { BACKEND_ENABLED, ROUTES } from "@/lib/constants"

const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  student: GraduationCap,
  professor: BookOpen,
  developer: Code,
  worker: HardHat,
}

const ROLE_COLORS: Record<UserRole, string> = {
  student: "text-blue-500",
  professor: "text-purple-500",
  developer: "text-green-500",
  worker: "text-amber-500",
}

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function ProfileSummary() {
  const { profile, roleConfig, parish, rlma, employer } = useProfile()
  const occupation = useOccupation(profile.socCode)
  const sector = profile.sectorId
    ? SECTORS.find((s) => s.id === profile.sectorId)
    : null

  const RoleIcon = profile.role ? ROLE_ICONS[profile.role] : null

  if (!BACKEND_ENABLED) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            {RoleIcon && profile.role ? (
              <div className={cn("rounded-lg bg-muted p-2.5", ROLE_COLORS[profile.role])}>
                <RoleIcon className="h-5 w-5" />
              </div>
            ) : (
              <div className="rounded-lg bg-muted p-2.5 text-muted-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="font-semibold">{roleConfig?.label ?? "Not selected"}</p>
            </div>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link to={`${ROUTES.HOME}#roles`} className="gap-1">
              <Pencil className="h-3 w-3" />
              Change
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* SOC headline card — most prominent */}
      {occupation.data ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Your occupation</span>
                </div>
                <h2 className="text-xl font-bold">{occupation.data.title}</h2>
                <p className="font-mono text-xs text-muted-foreground">
                  {occupation.data.code}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary" className="text-xs">
                  {Math.round(occupation.data.scoreCard.exposure.value)}% exposure
                </Badge>
                {occupation.data.laMedianWage && (
                  <span className="text-xs text-muted-foreground">
                    LA median {USD.format(occupation.data.laMedianWage)}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" asChild>
                <Link to={`/occupations/${encodeURIComponent(occupation.data.code)}`}>
                  View full score card
                </Link>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <Link to="/onboarding/occupation" className="gap-1">
                  <Pencil className="h-3 w-3" /> Change
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div>
              <p className="font-medium">No occupation selected</p>
              <p className="text-sm text-muted-foreground">
                Tell us what you do so we can personalize the learning path.
              </p>
            </div>
            <Button asChild>
              <Link to="/onboarding/occupation" className="gap-1">
                <ClipboardCheck className="h-3.5 w-3.5" />
                Add
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Role + geography row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              {RoleIcon && profile.role ? (
                <div className={cn("rounded-lg bg-muted p-2.5", ROLE_COLORS[profile.role])}>
                  <RoleIcon className="h-5 w-5" />
                </div>
              ) : (
                <div className="rounded-lg bg-muted p-2.5 text-muted-foreground">
                  <HardHat className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-semibold">
                  {roleConfig?.label ?? "Not selected"}
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link to="/onboarding/role" className="gap-1">
                <Pencil className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2.5 text-sky-500">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Parish · RLMA</p>
                <p className="font-semibold">
                  {parish ? `${parish.name} Parish` : "Not selected"}
                </p>
                {rlma && (
                  <p className="text-xs text-muted-foreground">{rlma.name}</p>
                )}
              </div>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link to="/onboarding/parish" className="gap-1">
                <Pencil className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2.5 text-emerald-500">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sector</p>
                <p className="font-semibold">{sector?.label ?? "Not selected"}</p>
              </div>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link to="/onboarding/sector" className="gap-1">
                <Pencil className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2.5 text-amber-500">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Employer</p>
                <p className="font-semibold">
                  {employer?.name ?? "Not selected"}
                </p>
                {employer?.isMegaproject && (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    <Star className="mr-1 h-2.5 w-2.5 text-amber-500" />
                    Megaproject
                  </Badge>
                )}
              </div>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link to="/onboarding/employer" className="gap-1">
                <Pencil className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { USER_ROLES }
