import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuickAction = {
  label: string
  href: string
  icon: LucideIcon
  description?: string
}

// ─── QuickActions ─────────────────────────────────────────────────────────────

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <Button
            key={action.href}
            variant="outline"
            className="h-auto flex-col gap-1.5 py-4 text-left"
            render={<Link href={action.href} />}
          >
              <action.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
