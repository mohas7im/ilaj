"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { DoctorFilters, type DoctorFilterState } from "./_components/DoctorFilters"
import { DoctorTable } from "./_components/DoctorTable"
import { MOCK_DOCTORS } from "./_services/doctor.service"

export default function DoctorsPage() {
  const [filters, setFilters] = useState<DoctorFilterState>({
    search: "",
    specialization: "all",
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Doctors"
        description="Manage clinic doctors and practitioners."
        actions={[{ label: "+ Add Doctor", href: "/admin/doctors/create" }]}
      />
      <DoctorFilters filters={filters} onFiltersChange={setFilters} />
      <DoctorTable doctors={MOCK_DOCTORS} filters={filters} />
    </div>
  )
}
