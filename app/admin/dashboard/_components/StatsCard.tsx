import { Card, CardContent } from "@/components/admin/ui/card"
import type { StatItem } from "../_services/dashboard.service"

export function StatsCard({ title, value, icon: Icon }: StatItem) {
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
      </CardContent>
    </Card>
  )
}
