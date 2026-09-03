"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/admin/ui/select"
import { DOCTOR_SPECIALIZATIONS, DOCTOR_STATUS_CONFIG } from "../config"
import type { Doctor, DoctorStatus } from "../types"

type DoctorFormProps = {
  doctor?: Doctor
}

export function DoctorForm({ doctor }: DoctorFormProps) {
  const router = useRouter()
  const isEdit = !!doctor

  const [form, setForm] = useState({
    name:           doctor?.name           ?? "",
    email:          doctor?.email          ?? "",
    phone:          doctor?.phone          ?? "",
    specialization: doctor?.specialization ?? "",
    bio:            doctor?.bio            ?? "",
    status:         doctor?.status         ?? ("active" as DoctorStatus),
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call POST /api/admin/doctors (create) or PATCH /api/admin/doctors/:id (edit)
    router.push("/admin/doctors")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEdit ? "Edit Doctor" : "Add Doctor"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Dr. Full Name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="specialization">Specialization <span className="text-destructive">*</span></Label>
              <Select value={form.specialization} onValueChange={(v) => set("specialization", v ?? "")}>
                <SelectTrigger id="specialization" aria-label="Select specialization">
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {DOCTOR_SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="doctor@clinic.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+92-300-0000000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", (v ?? "active") as DoctorStatus)}>
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(DOCTOR_STATUS_CONFIG) as DoctorStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{DOCTOR_STATUS_CONFIG[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Brief professional biography..."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/doctors")}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Add Doctor"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
