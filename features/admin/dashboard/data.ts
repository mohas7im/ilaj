// ─── Dashboard Mock Data & Types ──────────────────────────────────────────────
// All mock values are defined here. Replace with real API calls when backend
// is ready. UI components import from this file — no values in JSX.

import { CalendarDays, Users, Stethoscope, MessageSquare } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatItem = {
  title: string
  value: string
  icon: LucideIcon
  description?: string
  trend?: { value: number; label: string }
}

export type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled"

export type Appointment = {
  id: string
  patient: string
  doctor: string
  date: string
  time: string
  service: string
  status: AppointmentStatus
}

export type ActivityType = "appointment" | "patient" | "inquiry" | "doctor"

export type ActivityItem = {
  id: string
  type: ActivityType
  title: string
  description: string
  time: string
  status: AppointmentStatus | "info"
}

export type ChartDataPoint = {
  day: string
  scheduled: number
  completed: number
  cancelled: number
}

// ─── Mock Stats ───────────────────────────────────────────────────────────────

export const MOCK_STATS: StatItem[] = [
  {
    title: "Total Appointments",
    value: "128",
    icon: CalendarDays,
    trend: { value: 12, label: "from last month" },
  },
  {
    title: "Today's Appointments",
    value: "24",
    icon: CalendarDays,
    description: "Scheduled for today",
  },
  {
    title: "Patients",
    value: "1,248",
    icon: Users,
    trend: { value: 8, label: "from last month" },
  },
  {
    title: "Pending Inquiries",
    value: "12",
    icon: MessageSquare,
    trend: { value: -3, label: "from last week" },
  },
]

// ─── Mock Appointments ────────────────────────────────────────────────────────

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patient: "Sara Ahmed",
    doctor: "Dr. Khan",
    date: "2024-09-03",
    time: "09:00 AM",
    service: "General Checkup",
    status: "confirmed",
  },
  {
    id: "2",
    patient: "Omar Farooq",
    doctor: "Dr. Raza",
    date: "2024-09-03",
    time: "10:30 AM",
    service: "Teeth Cleaning",
    status: "completed",
  },
  {
    id: "3",
    patient: "Aisha Malik",
    doctor: "Dr. Noor",
    date: "2024-09-03",
    time: "11:00 AM",
    service: "Root Canal",
    status: "pending",
  },
  {
    id: "4",
    patient: "Tariq Hussain",
    doctor: "Dr. Khan",
    date: "2024-09-03",
    time: "02:00 PM",
    service: "Dental Implant",
    status: "cancelled",
  },
  {
    id: "5",
    patient: "Hina Baig",
    doctor: "Dr. Raza",
    date: "2024-09-03",
    time: "03:30 PM",
    service: "Braces Consultation",
    status: "confirmed",
  },
]

// ─── Mock Activity ────────────────────────────────────────────────────────────

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    type: "appointment",
    title: "New appointment booked",
    description: "Sara Ahmed — General Checkup, Dr. Khan",
    time: "2m ago",
    status: "confirmed",
  },
  {
    id: "2",
    type: "patient",
    title: "New patient registered",
    description: "Omar Farooq — Walk-in registration",
    time: "14m ago",
    status: "info",
  },
  {
    id: "3",
    type: "inquiry",
    title: "New inquiry received",
    description: "Question about dental implant pricing",
    time: "1h ago",
    status: "pending",
  },
  {
    id: "4",
    type: "appointment",
    title: "Appointment completed",
    description: "Aisha Malik — Teeth Cleaning, Dr. Raza",
    time: "2h ago",
    status: "completed",
  },
  {
    id: "5",
    type: "appointment",
    title: "Appointment cancelled",
    description: "Tariq Hussain — Root Canal, Dr. Noor",
    time: "3h ago",
    status: "cancelled",
  },
]

// ─── Mock Chart Data ──────────────────────────────────────────────────────────

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { day: "Mon", scheduled: 12, completed: 10, cancelled: 2 },
  { day: "Tue", scheduled: 18, completed: 15, cancelled: 1 },
  { day: "Wed", scheduled: 22, completed: 18, cancelled: 3 },
  { day: "Thu", scheduled: 16, completed: 14, cancelled: 2 },
  { day: "Fri", scheduled: 24, completed: 20, cancelled: 4 },
  { day: "Sat", scheduled: 14, completed: 12, cancelled: 2 },
  { day: "Sun", scheduled: 8, completed: 7, cancelled: 1 },
]
