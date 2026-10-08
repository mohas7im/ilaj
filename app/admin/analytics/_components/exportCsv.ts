import type { AnalyticsListItem, AnalyticsReport } from "../_types/analytics.types"

const cell = (v: string | number) => {
  const s = String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Downloads the whole report as one CSV: Section, Item, Value. */
export function exportAnalyticsCsv(report: AnalyticsReport) {
  const rows: (string | number)[][] = [["Section", "Item", "Value"]]
  const add = (section: string, items: AnalyticsListItem[]) =>
    items.forEach((i) => rows.push([section, i.sublabel ? `${i.label} (${i.sublabel})` : i.label, i.value]))

  rows.push(["Period", "Start date", report.startDate], ["Period", "End date", report.endDate])
  rows.push(
    ["Summary", "Visitors", report.summary.activeUsers],
    ["Summary", "Sessions", report.summary.sessions],
    ["Summary", "Page views", report.summary.pageViews],
    ["Summary", "Avg. visit time (seconds)", Math.round(report.summary.avgSessionDuration)],
    ["Leads", "Total leads", report.leads.total]
  )
  add("Leads", report.leads.byType)
  report.timeseries.forEach((d) => rows.push(["Daily visitors", d.date, d.activeUsers]))
  add("Top pages (views)", report.topPages)
  add("Landing pages (sessions)", report.landingPages)
  add("Traffic channels (sessions)", report.channels)
  add("Traffic sources (sessions)", report.sources)
  add("Devices (visitors)", report.devices)
  add("New vs returning (visitors)", report.newVsReturning)
  add("Cities (visitors)", report.cities)
  report.searchQueries?.forEach((q) => rows.push(["Google search keywords (clicks)", q.query, q.clicks]))

  const csv = rows.map((r) => r.map(cell).join(",")).join("\r\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const a = document.createElement("a")
  a.href = url
  a.download = `analytics_${report.startDate}_to_${report.endDate}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
