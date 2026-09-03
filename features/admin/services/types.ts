// ─── Service Types ────────────────────────────────────────────────────────────

export type ServiceStatus = "active" | "inactive"

export type Service = {
  id: string
  name: string
  description?: string
  duration: number   // in minutes
  price: number      // in local currency
  status: ServiceStatus
  image?: string
  createdAt: string
}
