import type { ServiceStatus } from "@/domain/service/service.types"

// Badge label/variant per status — admin UI only, so it lives beside the components.
export const SERVICE_STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  active:   { label: "Active",   variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
}
