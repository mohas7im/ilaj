import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/admin/ui/card"
import type { StatItem } from "@/features/admin/dashboard/data"

// ─── StatsCard ────────────────────────────────────────────────────────────────

export function StatsCard({ title, value, icon: Icon, description, trend }: StatItem) {
  const isPositive = (trend?.value ?? 0) >= 0

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>

        {(trend || description) && (
          <div className="mt-3 flex items-center gap-1">
            {trend ? (
              <>
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                )}
                <span
                  className={`text-xs font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
