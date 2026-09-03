import Link from "next/link"
import { Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"
import { Badge } from "@/components/admin/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { DOCTOR_STATUS_CONFIG } from "../config"
import type { Doctor } from "../types"

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium">{value ?? "—"}</dd>
    </div>
  )
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

type DoctorDetailsProps = { doctor: Doctor }

export function DoctorDetails({ doctor: d }: DoctorDetailsProps) {
  const { label, variant } = DOCTOR_STATUS_CONFIG[d.status]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-base">{initials(d.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-semibold">{d.name}</h2>
              <p className="text-sm text-muted-foreground">{d.specialization}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" render={<Link href={`/admin/doctors/${d.id}/edit`} />}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <div className="grid grid-cols-3 gap-2 py-2">
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="col-span-2">
                <Badge variant={variant}>{label}</Badge>
              </dd>
            </div>
            <DetailRow label="Email" value={d.email} />
            <DetailRow label="Phone" value={d.phone} />
            {d.bio && <DetailRow label="Bio" value={d.bio} />}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal">Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="ID" value={d.id} />
            <DetailRow label="Joined" value={new Date(d.createdAt).toLocaleDateString()} />
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
