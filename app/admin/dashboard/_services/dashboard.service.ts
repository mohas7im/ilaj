import { apiClient } from "@/lib/apiClient"
import type { LucideIcon } from "lucide-react"
import type {
  DashboardStats,
  DashboardInquiriesResponse,
} from "../_types/dashboard.types"

export type {
  DashboardStats,
  DashboardInquiry,
  DashboardInquiriesResponse,
  ActivityItem,
  ActivityType,
} from "../_types/dashboard.types"

export type StatItem = {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStats>("/api/admin/dashboard/stats")
  return data
}

export async function fetchDashboardInquiries(params?: {
  pageNumber?: number
  pageSize?: number
}): Promise<DashboardInquiriesResponse> {
  const query = new URLSearchParams()
  query.set("pageNumber", String(params?.pageNumber || 1))
  query.set("pageSize", String(params?.pageSize || 5))

  const { data } = await apiClient.get<DashboardInquiriesResponse>(
    `/api/admin/inquiries?${query.toString()}`
  )
  return data
}
