import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import type { AnalyticsListItem } from "../_types/analytics.types"

type BarListProps = {
  title: string
  description: string
  items: AnalyticsListItem[]
  formatLabel?: (label: string) => string
}

export function BarList({ title, description, items, formatLabel }: BarListProps) {
  const max = Math.max(1, ...items.map((i) => i.value))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No data yet</p>
        ) : (
          <ul className="space-y-1">
            {items.map((item) => (
              <li
                key={item.label}
                className="relative flex items-center justify-between gap-3 px-2 py-1.5 text-sm"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-md bg-primary/10"
                  style={{ width: `${(item.value / max) * 100}%` }}
                  aria-hidden="true"
                />
                <span className="relative truncate" title={item.label}>
                  {formatLabel ? formatLabel(item.label) : item.label}
                </span>
                <span className="relative shrink-0 font-medium tabular-nums">
                  {item.value.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
