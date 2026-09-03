import { type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { cn } from "@/lib/utils"

export type StatsCardProps = {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  const isPositive = trend && trend.value >= 0

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {trend && (
          <p className="mt-1 text-xs text-muted-foreground">
            <span
              className={cn(
                "font-medium",
                isPositive ? "text-emerald-600" : "text-destructive"
              )}
            >
              {isPositive ? "+" : ""}
              {trend.value}%
            </span>{" "}
            {trend.label}
          </p>
        )}
        {description && !trend && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
