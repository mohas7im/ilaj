import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/admin/ui/button"
import { Separator } from "@/components/admin/ui/separator"

// ─── Types ────────────────────────────────────────────────────────────────────

type Action = {
  label: string
  href?: string
  onClick?: () => void
  variant?: "default" | "outline" | "ghost" | "secondary"
}

type PageHeaderProps = {
  title: string
  description?: string
  /** Primary / secondary action buttons shown top-right */
  actions?: Action[]
  /** Optional custom right-side content */
  children?: ReactNode
  /** Show a separator below the header */
  separator?: boolean
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  description,
  actions,
  children,
  separator = true,
}: PageHeaderProps) {
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: title + description */}
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Right: actions or custom content */}
        {(actions?.length || children) && (
          <div className="flex shrink-0 items-center gap-2">
            {actions?.map((action) =>
              action.href ? (
                <Button
                  key={action.label}
                  variant={action.variant ?? "default"}
                  render={<Link href={action.href} />}
                >
                  {action.label}
                </Button>
              ) : (
                <Button
                  key={action.label}
                  variant={action.variant ?? "default"}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              )
            )}
            {children}
          </div>
        )}
      </div>

      {separator && <Separator className="mt-4" />}
    </div>
  )
}
