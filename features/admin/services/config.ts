import type { Service, ServiceStatus } from "./types"

// ─── Status config ─────────────────────────────────────────────────────────────

export const SERVICE_STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active:   { label: "Active",   variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
}

/** Format a duration in minutes to a readable string */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}min` : `${h}h`
}

/** Format a price number to display string */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString()}`
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace with API call: GET /api/admin/services

export const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    name: "General Checkup",
    description: "Comprehensive dental examination including X-rays and cleaning assessment.",
    duration: 30,
    price: 1500,
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s2",
    name: "Teeth Cleaning",
    description: "Professional scaling and polishing to remove plaque and tartar buildup.",
    duration: 45,
    price: 2500,
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s3",
    name: "Root Canal",
    description: "Endodontic therapy to treat infection inside the tooth pulp.",
    duration: 90,
    price: 12000,
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s4",
    name: "Dental Implant Consultation",
    description: "Initial consultation and treatment planning for dental implants.",
    duration: 60,
    price: 3000,
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s5",
    name: "Braces Consultation",
    description: "Orthodontic assessment and treatment planning for braces or aligners.",
    duration: 60,
    price: 2000,
    status: "active",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "s6",
    name: "Teeth Whitening",
    description: "Professional in-office whitening treatment for a brighter smile.",
    duration: 60,
    price: 8000,
    status: "inactive",
    createdAt: "2023-02-01T00:00:00Z",
  },
]
