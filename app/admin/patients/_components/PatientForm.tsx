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
import type { Patient } from "../_types/patient.types"

export type PatientFormProps = {
  mode: "create" | "edit"
  initialData?: Patient
}

export function PatientForm({ mode, initialData }: PatientFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"

  const [form, setForm] = useState({
    name:           initialData?.name           ?? "",
    email:          initialData?.email          ?? "",
    phone:          initialData?.phone          ?? "",
    dateOfBirth:    initialData?.dateOfBirth    ?? "",
    gender:         initialData?.gender         ?? ("male" as "male" | "female" | "other"),
    address:        initialData?.address        ?? "",
    medicalHistory: initialData?.medicalHistory ?? "",
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && initialData?.id) {
        await fetch(`/api/patients/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
    } catch {
      // Fallback
    }
    router.push("/admin/patients")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEdit ? "Edit Patient" : "Register Patient"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Ali Hassan"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="patient@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+92 300 0000000"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => set("gender", (v ?? "male") as "male" | "female" | "other")}
              >
                <SelectTrigger id="gender" aria-label="Select gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Residential Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Address / Town / City"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="medicalHistory">Medical History / Allergies</Label>
              <Textarea
                id="medicalHistory"
                value={form.medicalHistory}
                onChange={(e) => set("medicalHistory", e.target.value)}
                placeholder="Record any systemic conditions, allergies, or prior dental surgeries..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/patients")}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Register Patient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
