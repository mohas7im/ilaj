"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Calendar, Clock, Stethoscope, User, Phone, Mail, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { LoadingState } from "@/components/admin/ui/loading-state"
import type { Inquiry } from "@/domain/inquiry/inquiry.types"
import { getInquiryById } from "../_services/inquiry.api"
import { getApiErrorMessage } from "@/lib/api/errors"

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

type InquiryDetailsProps = { id: string }

export function InquiryDetails({ id }: InquiryDetailsProps) {
  const router = useRouter()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)

  useEffect(() => {
    let active = true
    getInquiryById(id)
      .then((data) => {
        if (!active) return
        if (!data) {
          toast.error("Inquiry not found")
          router.push("/admin/inquiries")
          return
        }
        setInquiry(data)
      })
      .catch((error) => {
        if (!active) return
        toast.error(getApiErrorMessage(error, "Failed to load inquiry"))
        router.push("/admin/inquiries")
      })
    return () => {
      active = false
    }
  }, [id, router])

  if (!inquiry) {
    return (
      <Card>
        <CardContent>
          <LoadingState spinner label="Loading inquiry..." />
        </CardContent>
      </Card>
    )
  }

  return <InquiryDetailsView inquiry={inquiry} />
}

type InquiryDetailsViewProps = { inquiry: Inquiry }

function InquiryDetailsView({ inquiry: inq }: InquiryDetailsViewProps) {
  const displayName = inq.fullName
  const treatmentName = inq.treatment
  // "inquiry" = question sent from a treatment page; otherwise a booking request
  const isQuestion = inq.type === "inquiry"

  return (
    <div className="space-y-5">
      {/* Appointment / Treatment Request Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            {isQuestion ? "Treatment Question" : <>Requested Treatment &amp; Slot</>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="Type" value={isQuestion ? "Question (from treatment page)" : "Appointment request"} />
            <DetailRow icon={Stethoscope} label="Treatment" value={treatmentName} />
            {!isQuestion && (
              <>
                <DetailRow icon={Calendar} label="Preferred Date" value={inq.preferredDate || "Not specified"} />
                <DetailRow icon={Clock} label="Preferred Time" value={inq.preferredTime || "Flexible"} />
              </>
            )}
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
            {isQuestion ? "Patient Question" : "Patient Message"}
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
