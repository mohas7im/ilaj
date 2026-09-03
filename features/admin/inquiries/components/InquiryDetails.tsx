"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import { Separator } from "@/components/admin/ui/separator"
import { InquiryStatusBadge } from "./InquiryStatusBadge"
import { INQUIRY_STATUSES, INQUIRY_STATUS_CONFIG } from "../config"
import type { Inquiry, InquiryStatus } from "../types"

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-sm font-medium break-words">{value ?? "—"}</dd>
    </div>
  )
}

type InquiryDetailsProps = { inquiry: Inquiry }

export function InquiryDetails({ inquiry: inq }: InquiryDetailsProps) {
  const [status, setStatus] = useState<InquiryStatus>(inq.status)

  const handleStatusChange = (newStatus: InquiryStatus) => {
    setStatus(newStatus)
    // TODO: call PATCH /api/admin/inquiries/:id { status: newStatus }
  }

  return (
    <div className="space-y-4">
      {/* Contact info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="Name" value={inq.name} />
            <DetailRow label="Email" value={inq.email} />
            <DetailRow label="Phone" value={inq.phone} />
          </dl>
        </CardContent>
      </Card>

      {/* Message */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Inquiry</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="Subject" value={inq.subject} />
          </dl>
          <div className="mt-3 rounded-md bg-muted/40 p-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{inq.message}</p>
          </div>
        </CardContent>
      </Card>

      {/* Status management */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <InquiryStatusBadge status={status} />
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={(v) => handleStatusChange((v ?? status) as InquiryStatus)}>
                <SelectTrigger className="h-8 w-[160px]" aria-label="Change status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INQUIRY_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {INQUIRY_STATUS_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={() => handleStatusChange(status)} variant="outline">
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal">Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <DetailRow label="ID" value={inq.id} />
            <DetailRow label="Received" value={new Date(inq.createdAt).toLocaleString()} />
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
