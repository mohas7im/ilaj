import { notFound } from "next/navigation"
import { PageHeader } from "@/components/admin/common/PageHeader"
import { AppointmentDetails } from "@/features/admin/appointments/components/AppointmentDetails"
import { MOCK_APPOINTMENTS } from "@/features/admin/appointments/config"

type Props = { params: Promise<{ id: string }> }

export default async function AppointmentDetailPage({ params }: Props) {
  const { id } = await params
  const appointment = MOCK_APPOINTMENTS.find((a) => a.id === id)
  if (!appointment) notFound()

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Appointment — ${appointment.patient}`}
        description={`${appointment.date} at ${appointment.time}`}
        actions={[{ label: "Back", href: "/admin/appointments", variant: "outline" }]}
      />
      <div className="max-w-2xl">
        <AppointmentDetails appointment={appointment} />
      </div>
    </div>
  )
}
