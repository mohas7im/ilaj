import Link from "next/link"
import { Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import { Button } from "@/components/admin/ui/button"
import { SERVICE_STATUS_CONFIG, formatDuration, formatPrice } from "../config"
import type { Service } from "../types"

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium">{value ?? "—"}</dd>
    </div>
  )
}

type ServiceDetailsProps = { service: Service }

export function ServiceDetails({ service: s }: ServiceDetailsProps) {
  const { label, variant } = SERVICE_STATUS_CONFIG[s.status]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Service Information</CardTitle>
          <Button variant="outline" size="sm" render={<Link href={`/admin/services/${s.id}/edit`} />}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="Name" value={s.name} />
            {s.description && <DetailRow label="Description" value={s.description} />}
            <DetailRow label="Duration" value={formatDuration(s.duration)} />
            <DetailRow label="Price" value={formatPrice(s.price)} />
            <div className="grid grid-cols-3 gap-2 py-2">
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="col-span-2">
                <Badge variant={variant}>{label}</Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal">Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="ID" value={s.id} />
            <DetailRow label="Created" value={new Date(s.createdAt).toLocaleDateString()} />
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
