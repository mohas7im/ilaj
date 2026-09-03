import Link from "next/link"
import { Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Separator } from "@/components/admin/ui/separator"
import { AppointmentStatusBadge } from "./AppointmentStatusBadge"
import type { Appointment } from "../types"

type AppointmentDetailsProps = {
  appointment: Appointment
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium">{value ?? "—"}</dd>
    </div>
  )
}

export function AppointmentDetails({ appointment: a }: AppointmentDetailsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Appointment Information</CardTitle>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/admin/appointments/${a.id}/edit`} />}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="Patient" value={a.patient} />
            <DetailRow label="Doctor" value={a.doctor} />
            <DetailRow label="Service" value={a.service} />
            <DetailRow label="Date" value={a.date} />
            <DetailRow label="Time" value={a.time} />
            <div className="grid grid-cols-3 gap-2 py-2">
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="col-span-2">
                <AppointmentStatusBadge status={a.status} />
              </dd>
            </div>
            {a.notes && <DetailRow label="Notes" value={a.notes} />}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-muted-foreground font-normal text-sm">Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="ID" value={a.id} />
            <DetailRow
              label="Created"
              value={new Date(a.createdAt).toLocaleString()}
            />
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
