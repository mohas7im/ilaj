import { Users, Stethoscope, Briefcase, MessageSquare } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type StatItem = {
  title: string
  value: string
  icon: LucideIcon
  description?: string
  trend?: { value: number; label: string }
}

export type ActivityType = "patient" | "inquiry" | "doctor" | "service"

export type ActivityItem = {
  id: string
  type: ActivityType
  title: string
  description: string
  time: string
  status: "new" | "contacted" | "resolved" | "info"
}

export type DashboardInquiry = {
  id: string
  fullName: string
  name: string
  email: string
  phone?: string
  treatment: string
  preferredDate: string
  preferredTime: string
  subject: string
  status: "new" | "contacted" | "resolved"
  time: string
  createdAt?: string
}

export const MOCK_STATS: StatItem[] = [
  {
    title: "Total Patients",
    value: "1,248",
    icon: Users,
  },
  {
    title: "Active Doctors",
    value: "8",
    icon: Stethoscope,
  },
  {
    title: "Services Offered",
    value: "16",
    icon: Briefcase,
  },
  {
    title: "Pending Inquiries",
    value: "12",
    icon: MessageSquare,
  },
]

export const MOCK_RECENT_INQUIRIES: DashboardInquiry[] = [
  {
    id: "1",
    fullName: "Sara Ahmed",
    name: "Sara Ahmed",
    email: "sara@example.com",
    phone: "+92 300 1234567",
    treatment: "Dental Implants",
    preferredDate: "2024-09-15",
    preferredTime: "10:00 AM - 11:00 AM",
    subject: "Dental Implants",
    status: "new",
    time: "10m ago",
    createdAt: "2024-09-04T08:30:00Z",
  },
  {
    id: "2",
    fullName: "Omar Farooq",
    name: "Omar Farooq",
    email: "omar@example.com",
    phone: "+92 321 9876543",
    treatment: "Teeth Cleaning & Whitening",
    preferredDate: "2024-09-16",
    preferredTime: "02:00 PM - 03:00 PM",
    subject: "Teeth Cleaning & Whitening",
    status: "contacted",
    time: "1h ago",
    createdAt: "2024-09-03T14:15:00Z",
  },
  {
    id: "3",
    fullName: "Aisha Malik",
    name: "Aisha Malik",
    email: "aisha@example.com",
    phone: "+92 333 4567890",
    treatment: "Orthodontic Braces",
    preferredDate: "2024-09-18",
    preferredTime: "04:00 PM - 05:00 PM",
    subject: "Orthodontic Braces",
    status: "new",
    time: "3h ago",
    createdAt: "2024-09-03T11:00:00Z",
  },
  {
    id: "4",
    fullName: "Tariq Hussain",
    name: "Tariq Hussain",
    email: "tariq@example.com",
    phone: "+92 312 3456789",
    treatment: "Root Canal Treatment",
    preferredDate: "2024-09-14",
    preferredTime: "11:00 AM - 12:00 PM",
    subject: "Root Canal Treatment",
    status: "resolved",
    time: "Yesterday",
    createdAt: "2024-09-02T16:45:00Z",
  },
  {
    id: "5",
    fullName: "Hina Baig",
    name: "Hina Baig",
    email: "hina@example.com",
    phone: "+92 345 6789012",
    treatment: "Pediatric Dental Care",
    preferredDate: "2024-09-20",
    preferredTime: "03:00 PM - 04:00 PM",
    subject: "Pediatric Dental Care",
    status: "contacted",
    time: "2 days ago",
    createdAt: "2024-09-01T09:20:00Z",
  },
]

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    type: "inquiry",
    title: "New website inquiry",
    description: "Sara Ahmed — Dental Implants (10:00 AM)",
    time: "10m ago",
    status: "new",
  },
  {
    id: "2",
    type: "patient",
    title: "New patient registered",
    description: "Omar Farooq — Registered in directory",
    time: "1h ago",
    status: "info",
  },
  {
    id: "3",
    type: "inquiry",
    title: "Inquiry responded",
    description: "Tariq Hussain — Root Canal slot confirmed",
    time: "3h ago",
    status: "resolved",
  },
  {
    id: "4",
    type: "doctor",
    title: "Doctor profile updated",
    description: "Dr. Khan profile details updated",
    time: "5h ago",
    status: "info",
  },
  {
    id: "5",
    type: "service",
    title: "Service updated",
    description: "Teeth Whitening pricing adjusted",
    time: "1d ago",
    status: "info",
  },
]
