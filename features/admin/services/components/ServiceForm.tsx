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
import { SERVICE_STATUS_CONFIG } from "../config"
import type { Service, ServiceStatus } from "../types"

type ServiceFormProps = { service?: Service }

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter()
  const isEdit = !!service

  const [form, setForm] = useState({
    name:        service?.name        ?? "",
    description: service?.description ?? "",
    duration:    service ? String(service.duration) : "",
    price:       service ? String(service.price)    : "",
    status:      service?.status      ?? ("active" as ServiceStatus),
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call POST /api/admin/services or PATCH /api/admin/services/:id
    router.push("/admin/services")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEdit ? "Edit Service" : "Add Service"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Service Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Root Canal"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration (minutes) <span className="text-destructive">*</span></Label>
              <Input
                id="duration"
                type="number"
                min="5"
                step="5"
                value={form.duration}
                onChange={(e) => set("duration", e.target.value)}
                placeholder="e.g. 45"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">Price (Rs.) <span className="text-destructive">*</span></Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 2500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", (v ?? "active") as ServiceStatus)}>
                <SelectTrigger id="status" aria-label="Select status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SERVICE_STATUS_CONFIG) as ServiceStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{SERVICE_STATUS_CONFIG[s].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description of this service..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/services")}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Add Service"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
