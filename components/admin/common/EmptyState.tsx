import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

type EmptyStateProps = {
  title?: string
  description?: string
  icon?: LucideIcon
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({
  title = "No results",
  description = "Nothing to show here yet.",
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/30 px-6 py-16 text-center"
      role="status"
      aria-label={title}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action && (
        action.href ? (
          <Button variant="outline" size="sm" render={<Link href={action.href} />}>
            {action.label}
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
