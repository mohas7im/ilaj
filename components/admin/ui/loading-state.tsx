import { Skeleton } from "@/components/admin/ui/skeleton"

// ─── Types ────────────────────────────────────────────────────────────────────

type LoadingStateProps = {
  /** Number of skeleton rows to render (for table-like lists) */
  rows?: number
  /** Render as a single centered spinner (no rows) */
  spinner?: boolean
  /** Optional accessible label */
  label?: string
}

// ─── LoadingState ─────────────────────────────────────────────────────────────

export function LoadingState({ rows = 5, spinner = false, label = "Loading..." }: LoadingStateProps) {
  if (spinner) {
    return (
      <div
        className="flex items-center justify-center py-16"
        role="status"
        aria-label={label}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <span className="sr-only">{label}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

// ─── TableLoadingState ────────────────────────────────────────────────────────
// Specifically shaped for table rows.

export function TableLoadingState({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2" role="status" aria-label="Loading table...">
      <span className="sr-only">Loading table...</span>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
