"use client"

import { createContext, useContext } from "react"

type AdminBranding = {
  /** Settings → Clinic Name; empty until set */
  name: string
  /** Initials of the clinic name, for the logo mark */
  shortName: string
}

const AdminBrandingContext = createContext<AdminBranding>({ name: "", shortName: "" })

function toInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("")
}

// Clinic name for the admin chrome and login pages, loaded by app/admin/layout.tsx.
export function AdminBrandingProvider({
  clinicName,
  children,
}: {
  clinicName: string
  children: React.ReactNode
}) {
  return (
    <AdminBrandingContext value={{ name: clinicName, shortName: toInitials(clinicName) }}>
      {children}
    </AdminBrandingContext>
  )
}

export function useAdminBranding() {
  return useContext(AdminBrandingContext)
}
