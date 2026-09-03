import type { Doctor, DoctorStatus } from "./types"

// ─── Status config ─────────────────────────────────────────────────────────────

export const DOCTOR_STATUS_CONFIG: Record<
  DoctorStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active:   { label: "Active",   variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
}

export const DOCTOR_SPECIALIZATIONS = [
  "General Dentistry",
  "Orthodontics",
  "Endodontics",
  "Periodontics",
  "Prosthodontics",
  "Oral Surgery",
  "Pediatric Dentistry",
  "Cosmetic Dentistry",
] as const

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Replace with API call: GET /api/admin/doctors

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Khan",
    email: "khan@clinic.com",
    phone: "+92-300-1234567",
    specialization: "General Dentistry",
    bio: "Over 10 years of experience in general and cosmetic dentistry.",
    status: "active",
    createdAt: "2023-01-15T09:00:00Z",
  },
  {
    id: "d2",
    name: "Dr. Raza",
    email: "raza@clinic.com",
    phone: "+92-300-2345678",
    specialization: "Orthodontics",
    bio: "Specialist in braces and clear aligners with 8 years of practice.",
    status: "active",
    createdAt: "2023-03-10T09:00:00Z",
  },
  {
    id: "d3",
    name: "Dr. Noor",
    email: "noor@clinic.com",
    phone: "+92-300-3456789",
    specialization: "Endodontics",
    bio: "Expert in root canal therapy and endodontic microsurgery.",
    status: "active",
    createdAt: "2023-06-20T09:00:00Z",
  },
  {
    id: "d4",
    name: "Dr. Anwar",
    email: "anwar@clinic.com",
    phone: "+92-300-4567890",
    specialization: "Periodontics",
    status: "inactive",
    createdAt: "2022-11-01T09:00:00Z",
  },
]
