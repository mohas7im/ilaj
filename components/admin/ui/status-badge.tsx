import { Badge } from "@/components/admin/ui/badge"

type StatusBadgeProps = {
  status: string | boolean
  label?: string
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost"
  className?: string
}

export function StatusBadge({
  status,
  label,
  variant,
  className,
}: StatusBadgeProps) {
  let displayLabel = label
  let displayVariant = variant

  if (typeof status === "boolean") {
    displayLabel = label || (status ? "Active" : "Inactive")
    displayVariant = variant || (status ? "default" : "secondary")
  } else {
    displayLabel = label || status
    if (!displayVariant) {
      const lower = status.toLowerCase()
      if (lower === "active" || lower === "confirmed" || lower === "resolved") {
        displayVariant = "default"
      } else if (lower === "pending" || lower === "draft") {
        displayVariant = "secondary"
      } else if (lower === "cancelled" || lower === "rejected" || lower === "inactive") {
        displayVariant = "destructive"
      } else {
        displayVariant = "outline"
      }
    }
  }

  return (
    <Badge variant={displayVariant} className={className}>
      {displayLabel}
    </Badge>
  )
}
