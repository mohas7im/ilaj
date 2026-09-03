// ─── Appointment Types ────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show"

export type Appointment = {
  id: string
  patient: string
  doctor: string
  doctorId: string
  service: string
  serviceId: string
  date: string
  time: string
  status: AppointmentStatus
  notes?: string
  createdAt: string
}

export type AppointmentFilterState = {
  search: string
  status: AppointmentStatus | "all"
  doctorId: string
}
