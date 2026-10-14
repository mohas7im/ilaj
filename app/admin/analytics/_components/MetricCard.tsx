import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/admin/ui/card"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  title: string
  value: string
  icon: LucideIcon
  current: number
  previous: number
}

export function MetricCard({ title, value, icon: Icon, current, previous }: MetricCardProps) {
  // No previous data means there is nothing meaningful to compare against.
  const change = previous > 0 ? ((current - previous) / previous) * 100 : null
  const up = change !== null && change >= 0

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {change === null ? (
            "No data for previous period"
          ) : (
            <>
              <span
                className={cn(
                  "inline-flex items-center font-medium tabular-nums",
                  up ? "text-emerald-600" : "text-red-600"
                )}
              >
                {up ? (
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {Math.abs(change).toFixed(1)}%
              </span>{" "}
              vs previous period
            </>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
