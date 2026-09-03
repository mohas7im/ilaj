import { cn } from "@/lib/utils"

type DashboardSectionProps = {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

/**
 * Generic section wrapper for dashboard page areas.
 * Provides consistent spacing and optional title/description.
 */
export function DashboardSection({
  title,
  description,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
