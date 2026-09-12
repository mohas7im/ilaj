import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"

export type QuickAction = {
  label: string
  href: string
  icon: LucideIcon
  description?: string
}

type QuickActionsProps = {
  actions: QuickAction[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.href}
            variant="outline"
            className="h-auto flex-col gap-1.5 py-4"
            render={<Link href={action.href} />}
            aria-label={action.label}
          >
            <action.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
