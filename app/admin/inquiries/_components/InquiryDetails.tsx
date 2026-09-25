import { Calendar, Clock, Stethoscope, User, Phone, Mail, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import type { Inquiry } from "@/domain/inquiry/inquiry.types"

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value?: string
}) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2.5 items-center">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/80 shrink-0" />}
        <span>{label}</span>
      </dt>
      <dd className="col-span-2 text-sm font-medium break-words text-foreground">
        {value || "—"}
      </dd>
    </div>
  )
}

type InquiryDetailsProps = { inquiry: Inquiry }

export function InquiryDetails({ inquiry: inq }: InquiryDetailsProps) {
  const displayName = inq.fullName
  const treatmentName = inq.treatment

  return (
    <div className="space-y-5">
      {/* Appointment / Treatment Request Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            Requested Treatment &amp; Slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow icon={Stethoscope} label="Treatment" value={treatmentName} />
            <DetailRow icon={Calendar} label="Preferred Date" value={inq.preferredDate || "Not specified"} />
            <DetailRow icon={Clock} label="Preferred Time" value={inq.preferredTime || "Flexible"} />
          </dl>
        </CardContent>
      </Card>

      {/* Patient Information Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow icon={User} label="Full Name" value={displayName} />
            <DetailRow icon={Phone} label="Phone Number" value={inq.phone || "—"} />
            <DetailRow icon={Mail} label="Email Address" value={inq.email} />
          </dl>
        </CardContent>
      </Card>

      {/* Message Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Patient Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {inq.message || "No message provided."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meta Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y text-xs">
            <DetailRow label="Inquiry ID" value={inq.id} />
            <DetailRow label="Submitted At" value={new Date(inq.createdAt).toLocaleString()} />
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
