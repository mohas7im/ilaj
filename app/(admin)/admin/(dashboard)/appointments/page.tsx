"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/common/PageHeader"
import { AppointmentFilters } from "@/features/admin/appointments/components/AppointmentFilters"
import { AppointmentTable } from "@/features/admin/appointments/components/AppointmentTable"
import { MOCK_APPOINTMENTS } from "@/features/admin/appointments/config"
import { MOCK_DOCTORS } from "@/features/admin/doctors/config"
import type { AppointmentFilterState } from "@/features/admin/appointments/types"

export default function AppointmentsPage() {
  const [filters, setFilters] = useState<AppointmentFilterState>({
    search: "",
    status: "all",
    doctorId: "",
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Appointments"
        description="Manage and view all clinic appointments."
        actions={[{ label: "+ New Appointment", href: "/admin/appointments/new" }]}
      />

      <AppointmentFilters
        filters={filters}
        onFiltersChange={setFilters}
        doctors={MOCK_DOCTORS}
      />

      <AppointmentTable appointments={MOCK_APPOINTMENTS} filters={filters} />
    </div>
  )
}
