import { Badge } from "@/components/admin/ui/badge"
import { INQUIRY_STATUS_CONFIG } from "../config"
import type { InquiryStatus } from "../types"

type InquiryStatusBadgeProps = { status: InquiryStatus }

export function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
  const { label, variant } = INQUIRY_STATUS_CONFIG[status]
  return (
    <Badge variant={variant} aria-label={`Status: ${label}`}>
      {label}
    </Badge>
  )
}
