import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import type { ChartDataPoint } from "@/features/admin/dashboard/data"

// ─── AppointmentOverview ──────────────────────────────────────────────────────
// CSS-only bar chart — no charting library needed. Replace with a real chart
// component when recharts/chart.js is added to the project.

type AppointmentOverviewProps = {
  data: ChartDataPoint[]
}

const MAX_VALUE = 30 // used to calculate bar heights

function Bar({ value, color, label }: { value: number; color: string; label: string }) {
  const pct = Math.round((value / MAX_VALUE) * 100)
  return (
    <div className="flex flex-col items-center gap-1" title={`${label}: ${value}`}>
      <span className="text-xs text-muted-foreground tabular-nums">{value}</span>
      <div className="relative h-20 w-3 overflow-hidden rounded-sm bg-muted">
        <div
          className={`absolute bottom-0 left-0 right-0 rounded-sm transition-all ${color}`}
          style={{ height: `${pct}%` }}
          role="presentation"
        />
      </div>
    </div>
  )
}

export function AppointmentOverview({ data }: AppointmentOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Appointment Overview</CardTitle>
        <CardDescription>This week's appointment activity</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden="true" />
            Scheduled
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden="true" />
            Completed
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" aria-hidden="true" />
            Cancelled
          </div>
        </div>

        {/* Chart */}
        <div
          className="flex items-end justify-between gap-1 sm:gap-2"
          role="img"
          aria-label="Bar chart showing appointment activity by day"
        >
          {data.map((point) => (
            <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex items-end gap-0.5">
                <Bar value={point.scheduled} color="bg-primary" label="Scheduled" />
                <Bar value={point.completed} color="bg-emerald-500" label="Completed" />
                <Bar value={point.cancelled} color="bg-rose-400" label="Cancelled" />
              </div>
              <span className="text-xs text-muted-foreground">{point.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
