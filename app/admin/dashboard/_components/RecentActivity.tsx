import { Users, MessageSquare, Stethoscope, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { cn } from "@/lib/utils"
import type { ActivityItem, ActivityType } from "../_services/dashboard.service"

export type { ActivityItem }

const TYPE_ICON: Record<ActivityType, typeof Users> = {
  patient: Users,
  inquiry: MessageSquare,
  doctor: Stethoscope,
  service: Briefcase,
}

const STATUS_DOT: Record<string, string> = {
  new: "bg-primary",
  contacted: "bg-amber-400",
  resolved: "bg-emerald-500",
  completed: "bg-emerald-500",
  pending: "bg-amber-400",
  info: "bg-muted-foreground",
}

type RecentActivityProps = {
  items: ActivityItem[]
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const Icon = TYPE_ICON[item.type]
          return (
            <div key={item.id} className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>

              {/* Right side: status dot + time */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    STATUS_DOT[item.status] ?? "bg-muted"
                  )}
                  aria-label={`Status: ${item.status}`}
                />
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
