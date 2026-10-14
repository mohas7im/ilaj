import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { AnalyticsDateRange, AnalyticsResponse } from "../_types/analytics.types"

export async function fetchAnalytics(range: AnalyticsDateRange): Promise<AnalyticsResponse> {
  const { data } = await apiClient.get<AnalyticsResponse>(ENDPOINTS.admin.analytics, {
    params: range,
  })
  return data
}
