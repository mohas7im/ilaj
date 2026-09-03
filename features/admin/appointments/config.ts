import type { Appointment, AppointmentStatus } from "./types"

// ─── Status display config ─────────────────────────────────────────────────────

export const APPOINTMENT_STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  scheduled: { label: "Scheduled", variant: "secondary" },
  confirmed:  { label: "Confirmed", variant: "default" },
  completed:  { label: "Completed", variant: "outline" },
  cancelled:  { label: "Cancelled", variant: "destructive" },
  "no-show":  { label: "No Show",   variant: "destructive" },
}

export const APPOINTMENT_STATUSES = Object.keys(
  APPOINTMENT_STATUS_CONFIG
) as AppointmentStatus[]

// ─── Time slot options ─────────────────────────────────────────────────────────

export const TIME_SLOTS: string[] = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM",
]

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace with API call: GET /api/admin/appointments

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patient: "Sara Ahmed",
    doctor: "Dr. Khan",
    doctorId: "d1",
    service: "General Checkup",
    serviceId: "s1",
    date: "2024-09-03",
    time: "09:00 AM",
    status: "confirmed",
    notes: "First visit. Patient reports mild tooth sensitivity.",
    createdAt: "2024-09-01T09:00:00Z",
  },
  {
    id: "2",
    patient: "Omar Farooq",
    doctor: "Dr. Raza",
    doctorId: "d2",
    service: "Teeth Cleaning",
    serviceId: "s2",
    date: "2024-09-03",
    time: "10:30 AM",
    status: "completed",
    createdAt: "2024-09-01T10:00:00Z",
  },
  {
    id: "3",
    patient: "Aisha Malik",
    doctor: "Dr. Noor",
    doctorId: "d3",
    service: "Root Canal",
    serviceId: "s3",
    date: "2024-09-03",
    time: "11:00 AM",
    status: "scheduled",
    notes: "Patient is anxious. Please allow extra time.",
    createdAt: "2024-09-02T08:30:00Z",
  },
  {
    id: "4",
    patient: "Tariq Hussain",
    doctor: "Dr. Khan",
    doctorId: "d1",
    service: "Dental Implant Consultation",
    serviceId: "s4",
    date: "2024-09-03",
    time: "02:00 PM",
    status: "cancelled",
    createdAt: "2024-09-02T11:00:00Z",
  },
  {
    id: "5",
    patient: "Hina Baig",
    doctor: "Dr. Raza",
    doctorId: "d2",
    service: "Braces Consultation",
    serviceId: "s5",
    date: "2024-09-04",
    time: "03:30 PM",
    status: "scheduled",
    createdAt: "2024-09-02T14:00:00Z",
  },
  {
    id: "6",
    patient: "Bilal Akhtar",
    doctor: "Dr. Noor",
    doctorId: "d3",
    service: "General Checkup",
    serviceId: "s1",
    date: "2024-09-04",
    time: "09:30 AM",
    status: "no-show",
    createdAt: "2024-09-01T16:00:00Z",
  },
]
