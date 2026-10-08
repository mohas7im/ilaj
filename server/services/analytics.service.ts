import { SignJWT, importPKCS8 } from "jose"

// Reads reports from the Google Analytics 4 Data API (REST) with a service
// account. Uses jose + fetch instead of @google-analytics/data so it runs on
// both Node and Cloudflare Workers.
//
// Env:
//   GA_PROPERTY_ID   numeric property ID (GA → Admin → Property details)
//   GA_CLIENT_EMAIL  service account email (from its JSON key)
//   GA_PRIVATE_KEY   service account private key (from its JSON key)

export const ANALYTICS_RANGES = [7, 28, 90] as const
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number]

export interface AnalyticsSummary {
  activeUsers: number
  sessions: number
  pageViews: number
  avgSessionDuration: number // seconds
}

export interface AnalyticsListItem {
  label: string
  value: number
}

export interface AnalyticsReport {
  configured: true
  range: AnalyticsRange
  realtimeActiveUsers: number
  summary: AnalyticsSummary
  previousSummary: AnalyticsSummary
  timeseries: { date: string; activeUsers: number }[] // date = YYYY-MM-DD
  topPages: AnalyticsListItem[]
  sources: AnalyticsListItem[]
  devices: AnalyticsListItem[]
  cities: AnalyticsListItem[]
  fetchedAt: string
}

export type AnalyticsResponse = AnalyticsReport | { configured: false }

const API_BASE = "https://analyticsdata.googleapis.com/v1beta"
const TOKEN_URL = "https://oauth2.googleapis.com/token"
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly"
const CACHE_TTL_MS = 10 * 60 * 1000

function getConfig() {
  const propertyId = process.env.GA_PROPERTY_ID
  const clientEmail = process.env.GA_CLIENT_EMAIL
  // Keys pasted into env files usually carry literal "\n" sequences.
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (!propertyId || !clientEmail || !privateKey) return null
  return { propertyId, clientEmail, privateKey }
}

export function isAnalyticsConfigured(): boolean {
  return getConfig() !== null
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value
  }

  const key = await importPKCS8(privateKey, "RS256")
  const assertion = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key)

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Google auth failed: ${data.error_description ?? data.error ?? res.status}`)
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  return cachedToken.value
}

// ─── Data API ─────────────────────────────────────────────────────────────────

interface ReportRow {
  dimensionValues?: { value: string }[]
  metricValues?: { value: string }[]
}

interface Report {
  rows?: ReportRow[]
}

async function callApi<T>(path: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Google Analytics API error: ${data.error?.message ?? res.status}`)
  }
  return data as T
}

const num = (v?: string) => Number(v ?? 0) || 0

function toList(report: Report): AnalyticsListItem[] {
  return (report.rows ?? []).map((row) => ({
    label: row.dimensionValues?.[0]?.value || "(not set)",
    value: num(row.metricValues?.[0]?.value),
  }))
}

function topList(dimension: string, metric: string, limit: number, dateRange: object) {
  return {
    dateRanges: [dateRange],
    dimensions: [{ name: dimension }],
    metrics: [{ name: metric }],
    orderBys: [{ metric: { metricName: metric }, desc: true }],
    limit,
  }
}

const EMPTY_SUMMARY: AnalyticsSummary = {
  activeUsers: 0,
  sessions: 0,
  pageViews: 0,
  avgSessionDuration: 0,
}

function toSummary(row?: ReportRow): AnalyticsSummary {
  if (!row) return EMPTY_SUMMARY
  const m = row.metricValues ?? []
  return {
    activeUsers: num(m[0]?.value),
    sessions: num(m[1]?.value),
    pageViews: num(m[2]?.value),
    avgSessionDuration: num(m[3]?.value),
  }
}

// GA omits days with no traffic, so rebuild every day of the range.
// nthDay is the day's offset from the range start, which anchors the dates
// to the property's timezone rather than the server's.
function toTimeseries(report: Report, days: number) {
  const byDay = new Map<number, number>()
  let start: Date | null = null

  for (const row of report.rows ?? []) {
    const nth = num(row.dimensionValues?.[0]?.value)
    const ymd = row.dimensionValues?.[1]?.value ?? ""
    byDay.set(nth, num(row.metricValues?.[0]?.value))
    if (!start && ymd.length === 8) {
      start = new Date(Date.UTC(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8) - nth))
    }
  }

  if (!start) {
    const now = new Date()
    start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1)))
  }

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start!.getTime() + i * 86_400_000)
    return { date: d.toISOString().slice(0, 10), activeUsers: byDay.get(i) ?? 0 }
  })
}

// ─── Public ───────────────────────────────────────────────────────────────────

// Period reports are cached; the realtime count is always fetched fresh.
type PeriodReport = Omit<AnalyticsReport, "realtimeActiveUsers">
const reportCache = new Map<AnalyticsRange, { data: PeriodReport; expiresAt: number }>()

export async function getAnalyticsReport(range: AnalyticsRange): Promise<AnalyticsResponse> {
  const config = getConfig()
  if (!config) return { configured: false }

  const token = await getAccessToken(config.clientEmail, config.privateKey)
  const property = `properties/${config.propertyId}`

  const [period, realtime] = await Promise.all([
    getPeriodReport(property, token, range),
    callApi<Report>(`${property}:runRealtimeReport`, token, {
      metrics: [{ name: "activeUsers" }],
    }),
  ])

  return {
    ...period,
    realtimeActiveUsers: num(realtime.rows?.[0]?.metricValues?.[0]?.value),
  }
}

async function getPeriodReport(
  property: string,
  token: string,
  range: AnalyticsRange
): Promise<PeriodReport> {
  const cached = reportCache.get(range)
  if (cached && cached.expiresAt > Date.now()) return cached.data

  // Current period ends today; previous period is the same length just before it.
  const current = { startDate: `${range - 1}daysAgo`, endDate: "today" }
  const previous = { startDate: `${range * 2 - 1}daysAgo`, endDate: `${range}daysAgo` }

  const [batch, cities] = await Promise.all([
    callApi<{ reports: Report[] }>(`${property}:batchRunReports`, token, {
      // batchRunReports accepts at most 5 requests.
      requests: [
        {
          dateRanges: [current, previous],
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "averageSessionDuration" },
          ],
        },
        {
          dateRanges: [current],
          dimensions: [{ name: "nthDay" }, { name: "date" }],
          metrics: [{ name: "activeUsers" }],
        },
        topList("pagePath", "screenPageViews", 10, current),
        topList("sessionDefaultChannelGroup", "sessions", 8, current),
        topList("deviceCategory", "activeUsers", 5, current),
      ],
    }),
    callApi<Report>(`${property}:runReport`, token, topList("city", "activeUsers", 8, current)),
  ])

  const [summaryReport, timeseriesReport, pagesReport, sourcesReport, devicesReport] = batch.reports

  // With two date ranges GA adds a "dateRange" dimension: date_range_0 / date_range_1.
  const summaryRows = summaryReport.rows ?? []
  const rangeRow = (name: string) =>
    summaryRows.find((r) => r.dimensionValues?.[0]?.value === name)

  const data: PeriodReport = {
    configured: true,
    range,
    summary: toSummary(rangeRow("date_range_0")),
    previousSummary: toSummary(rangeRow("date_range_1")),
    timeseries: toTimeseries(timeseriesReport, range),
    topPages: toList(pagesReport),
    sources: toList(sourcesReport),
    devices: toList(devicesReport),
    cities: toList(cities),
    fetchedAt: new Date().toISOString(),
  }

  reportCache.set(range, { data, expiresAt: Date.now() + CACHE_TTL_MS })
  return data
}
