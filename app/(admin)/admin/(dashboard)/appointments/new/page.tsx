import { PageHeader } from "@/components/admin/common/PageHeader"
import { AppointmentForm } from "@/features/admin/appointments/components/AppointmentForm"
import { MOCK_DOCTORS } from "@/features/admin/doctors/config"
import { MOCK_SERVICES } from "@/features/admin/services/config"

export const metadata = { title: "New Appointment" }

export default function NewAppointmentPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="New Appointment"
        description="Schedule a new appointment."
        actions={[{ label: "Back", href: "/admin/appointments", variant: "outline" }]}
      />
      <div className="max-w-2xl">
        <AppointmentForm doctors={MOCK_DOCTORS} services={MOCK_SERVICES} />
      </div>
    </div>
  )
}
