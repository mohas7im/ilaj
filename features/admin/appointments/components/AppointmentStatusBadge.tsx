import { Badge } from "@/components/admin/ui/badge"
import { APPOINTMENT_STATUS_CONFIG } from "../config"
import type { AppointmentStatus } from "../types"

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const { label, variant } = APPOINTMENT_STATUS_CONFIG[status]
  return (
    <Badge variant={variant} aria-label={`Status: ${label}`}>
      {label}
    </Badge>
  )
}
