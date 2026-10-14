import { ArrowDownRight, ArrowUpRight, MessageCircle, Phone, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { cn } from "@/lib/utils"
import type { AnalyticsReport } from "../_types/analytics.types"

const ICONS = [Send, MessageCircle, Phone]

type LeadsCardProps = {
  leads: AnalyticsReport["leads"]
  visitors: number
}

export function LeadsCard({ leads, visitors }: LeadsCardProps) {
  const change =
    leads.previousTotal > 0 ? ((leads.total - leads.previousTotal) / leads.previousTotal) * 100 : null
  const conversion = visitors > 0 ? (leads.total / visitors) * 100 : 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Leads</CardTitle>
        <CardDescription>
          Visitors who submitted a form, opened WhatsApp or tapped the phone number
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1 lg:col-span-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Total leads
            </p>
            <p className="text-3xl font-semibold tabular-nums">{leads.total.toLocaleString()}</p>
            {change !== null && (
              <p
                className={cn(
                  "inline-flex items-center text-xs font-medium tabular-nums",
                  change >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {change >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {Math.abs(change).toFixed(1)}% vs previous period
              </p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Conversion rate
            </p>
            <p className="text-3xl font-semibold tabular-nums">{conversion.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">of visitors became leads</p>
          </div>
          {leads.byType.map((item, i) => {
            const Icon = ICONS[i] ?? Send
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-semibold tabular-nums">{item.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
