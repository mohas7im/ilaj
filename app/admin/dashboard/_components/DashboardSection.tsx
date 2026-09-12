import { cn } from "@/lib/utils"

type DashboardSectionProps = {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

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
