"use client"

import { createContext, useContext } from "react"

type AdminBranding = {
  /** Settings → Clinic Name; empty until set */
  name: string
}

const AdminBrandingContext = createContext<AdminBranding>({ name: "" })

// Clinic name for the admin chrome and login pages, loaded by app/admin/layout.tsx.
export function AdminBrandingProvider({
  clinicName,
  children,
}: {
  clinicName: string
  children: React.ReactNode
}) {
  return (
    <AdminBrandingContext value={{ name: clinicName }}>
      {children}
    </AdminBrandingContext>
  )
}

export function useAdminBranding() {
  return useContext(AdminBrandingContext)
}
