// ─── Doctor Types ─────────────────────────────────────────────────────────────

export type DoctorStatus = "active" | "inactive"

export type Doctor = {
  id: string
  name: string
  email: string
  phone: string
  specialization: string
  bio?: string
  image?: string
  status: DoctorStatus
  createdAt: string
}
