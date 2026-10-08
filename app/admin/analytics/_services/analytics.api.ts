import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { AnalyticsRange, AnalyticsResponse } from "../_types/analytics.types"

export async function fetchAnalytics(days: AnalyticsRange): Promise<AnalyticsResponse> {
  const { data } = await apiClient.get<AnalyticsResponse>(ENDPOINTS.admin.analytics, {
    params: { days },
  })
  return data
}
