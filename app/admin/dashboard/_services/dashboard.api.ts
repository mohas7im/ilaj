import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
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
  const { data } = await apiClient.get<DashboardStats>(ENDPOINTS.admin.dashboard.stats)
  return data
}

export async function fetchDashboardInquiries(params?: {
  pageNumber?: number
  pageSize?: number
}): Promise<DashboardInquiriesResponse> {
  const { data } = await apiClient.get<DashboardInquiriesResponse>(ENDPOINTS.admin.inquiries.list, {
    params: {
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 5,
    },
  })
  return data
}
