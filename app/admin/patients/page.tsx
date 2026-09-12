"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { PatientFilters, type PatientFilterState } from "./_components/PatientFilters"
import { PatientTable } from "./_components/PatientTable"
import { MOCK_PATIENTS } from "./_services/patient.service"

export default function PatientsPage() {
  const [filters, setFilters] = useState<PatientFilterState>({
    search: "",
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Patients"
        description="View and manage registered clinic patients and records."
        actions={[{ label: "+ Add Patient", href: "/admin/patients/create" }]}
      />
      <PatientFilters filters={filters} onFiltersChange={setFilters} />
      <PatientTable patients={MOCK_PATIENTS} filters={filters} />
    </div>
  )
}
