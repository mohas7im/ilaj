export type {
  AnalyticsSummary,
  AnalyticsListItem,
  AnalyticsReport,
  AnalyticsResponse,
  SearchQuery,
} from "@/server/services/analytics.service"

/** Inclusive date range, YYYY-MM-DD */
export type AnalyticsDateRange = { start: string; end: string }
