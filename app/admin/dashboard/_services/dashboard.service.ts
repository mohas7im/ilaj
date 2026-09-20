import { apiClient } from "@/lib/apiClient"
import type { LucideIcon } from "lucide-react"

export interface DashboardStats {
  totalInquiries: number
  totalDoctors: number
  totalServices: number
  totalTestimonials: number
}

export type StatItem = {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>("/api/dashboard/stats")
  return data
}
