"use client"

import { useEffect, useState } from "react"
import { Clock, Download, Eye, MousePointerClick, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/admin/ui/button"
import { Card, CardContent } from "@/components/admin/ui/card"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { fetchAnalytics } from "../_services/analytics.api"
import type { AnalyticsDateRange, AnalyticsResponse } from "../_types/analytics.types"
import { DateRangeControls, presetRange, type Preset } from "./DateRangeControls"
import { exportAnalyticsCsv } from "./exportCsv"
import { MetricCard } from "./MetricCard"
import { LeadsCard } from "./LeadsCard"
import { VisitorsChart } from "./VisitorsChart"
import { BarList } from "./BarList"
import { SearchQueriesCard } from "./SearchQueriesCard"
import { SetupNotice } from "./SetupNotice"

function formatDuration(seconds: number) {
  const s = Math.round(seconds)
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const formatPath = (path: string) => (path === "/" ? "/ (Home)" : path)
const formatSource = (source: string) => (source === "(direct)" ? "Direct" : source)

export function AnalyticsClientView() {
  const [preset, setPreset] = useState<Preset | null>(28)
  const [range, setRange] = useState<AnalyticsDateRange>(() => presetRange(28))
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setLoading(true)
        setFailed(false)
        const result = await fetchAnalytics(range)
        if (isMounted) setData(result)
      } catch (err) {
        console.error("Failed to load analytics:", err)
        if (isMounted) setFailed(true)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [range])

  if ((failed && !loading) || (data && !data.configured)) return <SetupNotice />

  const report = data?.configured ? data : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateRangeControls
          preset={preset}
          range={range}
          disabled={loading}
          onPresetChange={(p) => {
            setPreset(p)
            setRange(presetRange(p))
          }}
          onCustomChange={(r) => {
            setPreset(null)
            setRange(r)
          }}
        />
        {report && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-semibold tabular-nums">{report.realtimeActiveUsers}</span>
              <span className="text-muted-foreground">active right now</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => exportAnalyticsCsv(report)}>
              <Download data-icon="inline-start" aria-hidden="true" />
              Download CSV
            </Button>
          </div>
        )}
      </div>

      {loading || !report ? (
        <AnalyticsSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Visitors"
              value={report.summary.activeUsers.toLocaleString()}
              icon={Users}
              current={report.summary.activeUsers}
              previous={report.previousSummary.activeUsers}
            />
            <MetricCard
              title="Sessions"
              value={report.summary.sessions.toLocaleString()}
              icon={MousePointerClick}
              current={report.summary.sessions}
              previous={report.previousSummary.sessions}
            />
            <MetricCard
              title="Page Views"
              value={report.summary.pageViews.toLocaleString()}
              icon={Eye}
              current={report.summary.pageViews}
              previous={report.previousSummary.pageViews}
            />
            <MetricCard
              title="Avg. Visit Time"
              value={formatDuration(report.summary.avgSessionDuration)}
              icon={Clock}
              current={report.summary.avgSessionDuration}
              previous={report.previousSummary.avgSessionDuration}
            />
          </div>

          <LeadsCard leads={report.leads} visitors={report.summary.activeUsers} />

          <VisitorsChart data={report.timeseries} />

          <div className="grid gap-4 lg:grid-cols-2">
            <BarList
              title="Top pages"
              description="Most viewed pages"
              items={report.topPages}
              formatLabel={formatPath}
            />
            <BarList
              title="Landing pages"
              description="First page visitors arrived on (sessions)"
              items={report.landingPages}
              formatLabel={formatPath}
            />
            <BarList
              title="Traffic channels"
              description="How visitors found the website (sessions)"
              items={report.channels}
            />
            <BarList
              title="Traffic sources"
              description="Websites and apps that sent visitors (sessions)"
              items={report.sources}
              formatLabel={formatSource}
            />
            <BarList
              title="Devices"
              description="Visitors by device type"
              items={report.devices}
              formatLabel={capitalize}
            />
            <BarList
              title="New vs returning"
              description="First-time visitors and people who came back"
              items={report.newVsReturning}
              formatLabel={capitalize}
            />
            <BarList title="Top cities" description="Where visitors are located" items={report.cities} />
          </div>

          <SearchQueriesCard queries={report.searchQueries} />

          <p className="text-xs text-muted-foreground">
            Reports updated {formatDistanceToNow(new Date(report.fetchedAt), { addSuffix: true })}.
            Google Analytics data can take up to 48 hours to appear, and Search Console up to 3 days.
          </p>
        </>
      )}
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-72 w-full rounded-xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
