"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Textarea } from "@/components/admin/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/admin/ui/avatar"
import type { Doctor } from "../_types/doctor.types"

export type DoctorFormProps = {
  mode: "create" | "edit"
  initialData?: Doctor
}

function initials(name: string) {
  return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : ""
}

export function DoctorForm({ mode, initialData }: DoctorFormProps) {
  const router = useRouter()
  const isEdit = mode === "edit"
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name:           initialData?.name           ?? "",
    designation:    initialData?.designation    ?? "",
    specialization: initialData?.specialization ?? "",
    bio:            initialData?.bio            ?? "",
    image:          initialData?.image          ?? "",
    imageAlt:       initialData?.imageAlt       ?? "",
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      set("image", result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    set("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && initialData?.id) {
        await fetch(`/api/doctors/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
    } catch {
      // Fallback
    }
    router.push("/admin/doctors")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEdit ? "Edit Doctor" : "Add Doctor"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Update practitioner details, profile photo, and clinical credentials."
            : "Add a new dental specialist or practitioner to the clinic team."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Photo Upload */}
          <div className="space-y-3 p-4 rounded-lg border border-dashed border-border bg-muted/20">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
              Profile Photo
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-16 w-16 shrink-0 border border-border/60 shadow-xs">
                {form.image ? (
                  <AvatarImage src={form.image} alt={form.imageAlt || form.name || "Doctor photo"} />
                ) : null}
                <AvatarFallback className="text-muted-foreground bg-muted">
                  {form.name ? (
                    <span className="font-medium text-base">{initials(form.name)}</span>
                  ) : (
                    <ImageIcon className="h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                    aria-label="Upload profile photo"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    {form.image ? "Change Photo" : "Upload Photo"}
                  </Button>

                  {form.image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleRemoveImage}
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP or GIF. Max 5MB recommended.
                </p>
              </div>
            </div>

            {/* Profile Photo Alt Text */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <Label htmlFor="imageAlt" className="text-xs">
                Photo Alt Text
              </Label>
              <Input
                id="imageAlt"
                value={form.imageAlt}
                onChange={(e) => set("imageAlt", e.target.value)}
                placeholder="e.g. Portrait photo of Dr. Full Name in medical uniform"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
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
              <Label htmlFor="designation">Designation <span className="text-destructive">*</span></Label>
              <Input
                id="designation"
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
                placeholder="e.g. BDS, MDS"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="specialization">Specialization <span className="text-destructive">*</span></Label>
              <Input
                id="specialization"
                value={form.specialization}
                onChange={(e) => set("specialization", e.target.value)}
                placeholder="e.g. Orthodontics"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Brief professional biography, qualifications, and experience..."
              rows={4}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
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
