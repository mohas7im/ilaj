import { format, parseISO } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import type { AnalyticsReport } from "../_types/analytics.types"

const WIDTH = 600
const HEIGHT = 200

type VisitorsChartProps = {
  data: AnalyticsReport["timeseries"]
}

export function VisitorsChart({ data }: VisitorsChartProps) {
  const max = Math.max(1, ...data.map((d) => d.activeUsers))
  const step = data.length > 1 ? WIDTH / (data.length - 1) : WIDTH
  const points = data.map((d, i) => [i * step, HEIGHT - (d.activeUsers / max) * HEIGHT * 0.9])
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ")
  const area = `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`
  const label = (date: string) => format(parseISO(date), "d MMM")
  const middle = data[Math.floor(data.length / 2)]
  const last = data[data.length - 1]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Visitors over time</CardTitle>
        <CardDescription>Daily visitors to the website</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <div className="flex h-50 flex-col justify-between text-xs text-muted-foreground tabular-nums">
            <span>{max.toLocaleString()}</span>
            <span>0</span>
          </div>
          <div className="min-w-0 flex-1">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              preserveAspectRatio="none"
              className="h-50 w-full text-primary"
              role="img"
              aria-label="Daily visitors chart"
            >
              <line
                x1={0}
                y1={HEIGHT}
                x2={WIDTH}
                y2={HEIGHT}
                className="stroke-border"
                vectorEffect="non-scaling-stroke"
              />
              <path d={area} fill="currentColor" fillOpacity={0.1} />
              <path
                d={line}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* Invisible columns give each day a hover tooltip. */}
              {data.map((d, i) => (
                <rect
                  key={d.date}
                  x={i * step - step / 2}
                  y={0}
                  width={step}
                  height={HEIGHT}
                  fill="transparent"
                >
                  <title>{`${label(d.date)}: ${d.activeUsers.toLocaleString()} visitors`}</title>
                </rect>
              ))}
            </svg>
            {last && (
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{label(data[0].date)}</span>
                <span>{label(middle.date)}</span>
                <span>{label(last.date)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
