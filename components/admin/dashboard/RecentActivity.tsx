import { CalendarDays, UserPlus, Stethoscope, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Badge } from "@/components/admin/ui/badge"
import { Avatar, AvatarFallback } from "@/components/admin/ui/avatar"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityItem = {
  id: string
  type: "appointment" | "patient" | "doctor" | "inquiry"
  title: string
  description: string
  time: string
  status?: "pending" | "confirmed" | "completed" | "cancelled"
}

// ─── Mock data — replace with real API data ───────────────────────────────────

const ACTIVITY_ICONS = {
  appointment: CalendarDays,
  patient: UserPlus,
  doctor: Stethoscope,
  inquiry: MessageSquare,
}

const STATUS_VARIANT: Record<
  NonNullable<ActivityItem["status"]>,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  confirmed: "default",
  completed: "outline",
  cancelled: "destructive",
}

// ─── RecentActivity ───────────────────────────────────────────────────────────

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest updates across your system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const Icon = ACTIVITY_ICONS[item.type]
          return (
            <div key={item.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 rounded-md shrink-0">
                <AvatarFallback className="rounded-md bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.status && (
                    <Badge
                      variant={STATUS_VARIANT[item.status]}
                      className="shrink-0 text-xs capitalize"
                    >
                      {item.status}
                    </Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {item.time}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
