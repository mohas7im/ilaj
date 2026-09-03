"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_CONFIG, TIME_SLOTS } from "../config"
import type { Appointment, AppointmentStatus } from "../types"
import type { Doctor } from "@/features/admin/doctors/types"
import type { Service } from "@/features/admin/services/types"

type AppointmentFormProps = {
  /** Pass an existing appointment to enable edit mode */
  appointment?: Appointment
  doctors: Doctor[]
  services: Service[]
  /** Mode determines which status options are available */
  mode?: "create" | "edit"
}

export function AppointmentForm({
  appointment,
  doctors,
  services,
  mode = appointment ? "edit" : "create",
}: AppointmentFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"

  const [form, setForm] = useState({
    patient:   appointment?.patient   ?? "",
    doctorId:  appointment?.doctorId  ?? "",
    serviceId: appointment?.serviceId ?? "",
    date:      appointment?.date      ?? "",
    time:      appointment?.time      ?? "",
    status:    appointment?.status    ?? ("scheduled" as AppointmentStatus),
    notes:     appointment?.notes     ?? "",
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call POST /api/admin/appointments (create) or PATCH /api/admin/appointments/:id (edit)
    console.log("Form submitted:", form)
    router.push("/admin/appointments")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {isEdit ? "Edit Appointment" : "New Appointment"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Patient */}
            <div className="space-y-1.5">
              <Label htmlFor="patient">Patient Name <span className="text-destructive">*</span></Label>
              <Input
                id="patient"
                value={form.patient}
                onChange={(e) => set("patient", e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            {/* Doctor */}
            <div className="space-y-1.5">
              <Label htmlFor="doctor">Doctor <span className="text-destructive">*</span></Label>
              <Select value={form.doctorId} onValueChange={(v) => set("doctorId", v ?? "")}>
                <SelectTrigger id="doctor" aria-label="Select doctor">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.filter((d) => d.status === "active").map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} — {d.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service */}
            <div className="space-y-1.5">
              <Label htmlFor="service">Service <span className="text-destructive">*</span></Label>
              <Select value={form.serviceId} onValueChange={(v) => set("serviceId", v ?? "")}>
                <SelectTrigger id="service" aria-label="Select service">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.filter((s) => s.status === "active").map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="date">Date <span className="text-destructive">*</span></Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
              />
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <Label htmlFor="time">Time <span className="text-destructive">*</span></Label>
              <Select value={form.time} onValueChange={(v) => set("time", v ?? "")}>
                <SelectTrigger id="time" aria-label="Select time slot">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status (edit only) */}
            {isEdit && (
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", (v ?? "scheduled") as AppointmentStatus)}
                >
                  <SelectTrigger id="status" aria-label="Select status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {APPOINTMENT_STATUS_CONFIG[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Additional notes or special instructions..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/appointments")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Appointment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
