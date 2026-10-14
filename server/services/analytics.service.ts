import { SignJWT, importPKCS8 } from "jose"
import { LEAD_EVENTS, LEAD_EVENT_LABELS } from "@/lib/analytics/events"

// Reads reports from the Google Analytics 4 Data API and the Search Console
// API (both REST) with one service account. Uses jose + fetch instead of the
// Google client libraries so it runs on both Node and Cloudflare Workers.
//
// Env:
//   GA_PROPERTY_ID   numeric property ID (GA → Admin → Property details)
//   GA_CLIENT_EMAIL  service account email (from its JSON key)
//   GA_PRIVATE_KEY   service account private key (from its JSON key)
//   GSC_SITE_URL     optional Search Console property, e.g.
//                    "sc-domain:example.com" or "https://www.example.com/"

export interface AnalyticsSummary {
  activeUsers: number
  sessions: number
  pageViews: number
  avgSessionDuration: number // seconds
}

export interface AnalyticsListItem {
  label: string
  sublabel?: string
  value: number
}

export interface SearchQuery {
  query: string
  clicks: number
  impressions: number
  ctr: number // 0–1
  position: number
}

export interface AnalyticsReport {
  configured: true
  startDate: string // YYYY-MM-DD
  endDate: string
  realtimeActiveUsers: number
  summary: AnalyticsSummary
  previousSummary: AnalyticsSummary
  leads: { total: number; previousTotal: number; byType: AnalyticsListItem[] }
  timeseries: { date: string; activeUsers: number }[]
  topPages: AnalyticsListItem[]
  landingPages: AnalyticsListItem[]
  channels: AnalyticsListItem[]
  sources: AnalyticsListItem[]
  devices: AnalyticsListItem[]
  newVsReturning: AnalyticsListItem[]
  cities: AnalyticsListItem[]
  /** null when Search Console is not set up or not reachable */
  searchQueries: SearchQuery[] | null
  fetchedAt: string
}

export type AnalyticsResponse = AnalyticsReport | { configured: false }

const GA_API = "https://analyticsdata.googleapis.com/v1beta"
const GSC_API = "https://searchconsole.googleapis.com/webmasters/v3"
const TOKEN_URL = "https://oauth2.googleapis.com/token"
const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ")
const CACHE_TTL_MS = 10 * 60 * 1000
export const MAX_RANGE_DAYS = 400

function getConfig() {
  const propertyId = process.env.GA_PROPERTY_ID
  const clientEmail = process.env.GA_CLIENT_EMAIL
  // Keys pasted into env files usually carry literal "\n" sequences.
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n")
  if (!propertyId || !clientEmail || !privateKey) return null
  return { propertyId, clientEmail, privateKey, gscSiteUrl: process.env.GSC_SITE_URL }
}

// ─── Dates ────────────────────────────────────────────────────────────────────

const DAY_MS = 86_400_000
const ymdToMs = (ymd: string) => Date.parse(`${ymd}T00:00:00Z`)
const msToYmd = (ms: number) => new Date(ms).toISOString().slice(0, 10)
const addDays = (ymd: string, n: number) => msToYmd(ymdToMs(ymd) + n * DAY_MS)

export function isValidRange(start: string, end: string): boolean {
  const re = /^\d{4}-\d{2}-\d{2}$/
  if (!re.test(start) || !re.test(end)) return false
  const s = ymdToMs(start)
  const e = ymdToMs(end)
  return !isNaN(s) && !isNaN(e) && s <= e && (e - s) / DAY_MS < MAX_RANGE_DAYS
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value
  }

  const key = await importPKCS8(privateKey, "RS256")
  const assertion = await new SignJWT({ scope: SCOPES })
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

async function callApi<T>(url: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Google API error: ${data.error?.message ?? res.status}`)
  }
  return data as T
}

// ─── GA report helpers ────────────────────────────────────────────────────────

interface ReportRow {
  dimensionValues?: { value: string }[]
  metricValues?: { value: string }[]
}

interface Report {
  rows?: ReportRow[]
}

type DateRange = { startDate: string; endDate: string }

const num = (v?: string) => Number(v ?? 0) || 0
const dim = (row: ReportRow, i: number) => row.dimensionValues?.[i]?.value ?? ""

// With two date ranges GA adds a "dateRange" dimension (date_range_0 / date_range_1).
const isPrevious = (row: ReportRow) =>
  row.dimensionValues?.some((d) => d.value === "date_range_1") ?? false

function topList(dimensions: string[], metric: string, limit: number, range: DateRange) {
  return {
    dateRanges: [range],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: [{ name: metric }],
    orderBys: [{ metric: { metricName: metric }, desc: true }],
    limit,
  }
}

function toList(report: Report): AnalyticsListItem[] {
  return (report.rows ?? []).map((row) => ({
    label: dim(row, 0) || "(not set)",
    value: num(row.metricValues?.[0]?.value),
  }))
}

// Page titles come through as "Root Canal | Clinic Name"; keep the page part.
function toPageList(report: Report): AnalyticsListItem[] {
  return (report.rows ?? []).map((row) => {
    const path = dim(row, 0) || "(not set)"
    const title = dim(row, 1).split(" | ")[0].trim()
    return {
      label: title && title !== "(not set)" ? title : path,
      sublabel: path,
      value: num(row.metricValues?.[0]?.value),
    }
  })
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
function toTimeseries(report: Report, start: string, end: string) {
  const byDate = new Map<string, number>()
  for (const row of report.rows ?? []) {
    const d = dim(row, 0) // YYYYMMDD
    byDate.set(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`, num(row.metricValues?.[0]?.value))
  }
  const days = (ymdToMs(end) - ymdToMs(start)) / DAY_MS + 1
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(start, i)
    return { date, activeUsers: byDate.get(date) ?? 0 }
  })
}

function toLeads(report: Report): AnalyticsReport["leads"] {
  const current = new Map<string, number>()
  let total = 0
  let previousTotal = 0
  for (const row of report.rows ?? []) {
    const count = num(row.metricValues?.[0]?.value)
    if (isPrevious(row)) {
      previousTotal += count
    } else {
      total += count
      current.set(dim(row, 0), count)
    }
  }
  const byType = Object.values(LEAD_EVENTS).map((event) => ({
    label: LEAD_EVENT_LABELS[event],
    value: current.get(event) ?? 0,
  }))
  return { total, previousTotal, byType }
}

// ─── Search Console ───────────────────────────────────────────────────────────

interface GscResponse {
  rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[]
}

async function getSearchQueries(
  siteUrl: string | undefined,
  token: string,
  range: DateRange
): Promise<SearchQuery[] | null> {
  if (!siteUrl) return null
  try {
    const data = await callApi<GscResponse>(
      `${GSC_API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      token,
      { ...range, dimensions: ["query"], rowLimit: 10 }
    )
    return (data.rows ?? []).map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }))
  } catch (error) {
    // Search Console is optional; the rest of the report still loads.
    console.error("Search Console query failed:", error)
    return null
  }
}

// ─── Public ───────────────────────────────────────────────────────────────────

// Period reports are cached; the realtime count is always fetched fresh.
type PeriodReport = Omit<AnalyticsReport, "realtimeActiveUsers">
const reportCache = new Map<string, { data: PeriodReport; expiresAt: number }>()

/** start/end are YYYY-MM-DD, inclusive. Validate with isValidRange first. */
export async function getAnalyticsReport(start: string, end: string): Promise<AnalyticsResponse> {
  const config = getConfig()
  if (!config) return { configured: false }

  const token = await getAccessToken(config.clientEmail, config.privateKey)
  const property = `${GA_API}/properties/${config.propertyId}`

  const [period, realtime] = await Promise.all([
    getPeriodReport(property, config.gscSiteUrl, token, start, end),
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
  gscSiteUrl: string | undefined,
  token: string,
  start: string,
  end: string
): Promise<PeriodReport> {
  const cacheKey = `${start}_${end}`
  const cached = reportCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) return cached.data

  // Previous period: the same number of days just before this one.
  const days = (ymdToMs(end) - ymdToMs(start)) / DAY_MS + 1
  const current = { startDate: start, endDate: end }
  const previous = { startDate: addDays(start, -days), endDate: addDays(start, -1) }

  // batchRunReports accepts at most 5 requests each.
  const [batchA, batchB, searchQueries] = await Promise.all([
    callApi<{ reports: Report[] }>(`${property}:batchRunReports`, token, {
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
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }],
        },
        topList(["pagePath", "pageTitle"], "screenPageViews", 10, current),
        topList(["landingPage"], "sessions", 10, current),
        topList(["sessionDefaultChannelGroup"], "sessions", 8, current),
      ],
    }),
    callApi<{ reports: Report[] }>(`${property}:batchRunReports`, token, {
      requests: [
        topList(["sessionSource"], "sessions", 10, current),
        topList(["deviceCategory"], "activeUsers", 5, current),
        topList(["newVsReturning"], "activeUsers", 3, current),
        topList(["city"], "activeUsers", 8, current),
        {
          dateRanges: [current, previous],
          dimensions: [{ name: "eventName" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: {
            filter: {
              fieldName: "eventName",
              inListFilter: { values: Object.values(LEAD_EVENTS) },
            },
          },
        },
      ],
    }),
    getSearchQueries(gscSiteUrl, token, current),
  ])

  const [summaryReport, timeseriesReport, pagesReport, landingReport, channelsReport] =
    batchA.reports
  const [sourcesReport, devicesReport, newVsReturningReport, citiesReport, leadsReport] =
    batchB.reports

  const summaryRows = summaryReport.rows ?? []

  const data: PeriodReport = {
    configured: true,
    startDate: start,
    endDate: end,
    summary: toSummary(summaryRows.find((r) => !isPrevious(r))),
    previousSummary: toSummary(summaryRows.find(isPrevious)),
    leads: toLeads(leadsReport),
    timeseries: toTimeseries(timeseriesReport, start, end),
    topPages: toPageList(pagesReport),
    landingPages: toList(landingReport),
    channels: toList(channelsReport),
    sources: toList(sourcesReport),
    devices: toList(devicesReport),
    newVsReturning: toList(newVsReturningReport),
    cities: toList(citiesReport),
    searchQueries,
    fetchedAt: new Date().toISOString(),
  }

  for (const [key, entry] of reportCache) {
    if (entry.expiresAt <= Date.now()) reportCache.delete(key)
  }
  reportCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS })
  return data
}
