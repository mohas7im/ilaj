"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  MessageCircle,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Textarea } from "@/components/admin/ui/textarea"
import { Switch } from "@/components/admin/ui/switch"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/admin/ui/input-group"
import type { ClinicSettings } from "@/domain/settings/settings.types"
import { settingsApiService } from "../_services/settings.api"
import { getApiErrorMessage } from "@/lib/api/errors"

type SettingsFormProps = {
  initialSettings: ClinicSettings
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [initialData, setInitialData] = useState<ClinicSettings>(initialSettings)
  const [formData, setFormData] = useState<ClinicSettings>(initialSettings)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const data = await settingsApiService.get()
      setFormData(data)
      setInitialData(data)
    } catch (err: unknown) {
      console.error("Error fetching settings:", err)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = <K extends keyof ClinicSettings>(field: K, value: ClinicSettings[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setSuccess(false)
    setError(null)
  }

  const handleReset = () => {
    setFormData(initialData)
    setSuccess(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const updated = await settingsApiService.update(formData)
      setFormData(updated)
      setInitialData(updated)
      setSuccess(true)
      toast.success("Settings saved successfully!")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to update settings")
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl w-full mx-auto">
      {/* Top Banner Alert */}
      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-semibold">Settings saved successfully!</p>
            <p className="text-xs opacity-90">All changes have been updated across your clinic profile.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Section 1: Contact Information ───────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Manage public emails, telephone numbers, and clinic physical address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Primary Email */}
            <div className="space-y-2">
              <Label htmlFor="primaryEmail">
                Primary Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="primaryEmail"
                type="email"
                required
                value={formData.primaryEmail}
                onChange={(e) => handleChange("primaryEmail", e.target.value)}
              />
            </div>

            {/* Secondary Email */}
            <div className="space-y-2">
              <Label htmlFor="secondaryEmail">Secondary Email</Label>
              <Input
                id="secondaryEmail"
                type="email"
                value={formData.secondaryEmail}
                onChange={(e) => handleChange("secondaryEmail", e.target.value)}
              />
            </div>

            {/* Phone Number 1 */}
            <div className="space-y-2">
              <Label htmlFor="phone1">
                Phone Number 1 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone1"
                type="tel"
                required
                value={formData.phone1}
                onChange={(e) => handleChange("phone1", e.target.value)}
              />
            </div>

            {/* Phone Number 2 */}
            <div className="space-y-2">
              <Label htmlFor="phone2">Phone Number 2</Label>
              <Input
                id="phone2"
                type="tel"
                value={formData.phone2}
                onChange={(e) => handleChange("phone2", e.target.value)}
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="whatsappNumber" className="flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                WhatsApp Number
              </Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              />
            </div>

            {/* Address Textarea */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address" className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                required
                rows={3}
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 2: Clinic Statistics & Highlights ────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Clinic Highlights &amp; Statistics
          </CardTitle>
          <CardDescription>
            Key stats displayed in marketing counters and clinic introduction blocks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Year of Experience */}
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">
                Years of Experience <span className="text-destructive">*</span>
              </Label>
              <Input
                id="yearsOfExperience"
                required
                value={formData.yearsOfExperience}
                onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
              />
            </div>

            {/* Total Patients */}
            <div className="space-y-2">
              <Label htmlFor="totalPatients">
                Total Patients <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalPatients"
                required
                value={formData.totalPatients}
                onChange={(e) => handleChange("totalPatients", e.target.value)}
              />
            </div>

            {/* Satisfaction */}
            <div className="space-y-2">
              <Label htmlFor="satisfactionRate">
                Patient Satisfaction <span className="text-destructive">*</span>
              </Label>
              <Input
                id="satisfactionRate"
                required
                value={formData.satisfactionRate}
                onChange={(e) => handleChange("satisfactionRate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: Working Hours & Availability ───────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Working Time &amp; Sunday Status
          </CardTitle>
          <CardDescription>
            Configure clinic operation hours and Sunday availability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Weekday Working Time */}
            <div className="space-y-2">
              <Label htmlFor="workingHoursWeekday">
                Weekday Hours (Monday – Friday) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="workingHoursWeekday"
                required
                value={formData.workingHoursWeekday}
                onChange={(e) => handleChange("workingHoursWeekday", e.target.value)}
              />
            </div>

            {/* Saturday Working Time */}
            <div className="space-y-2">
              <Label htmlFor="workingHoursSaturday">
                Saturday Hours <span className="text-destructive">*</span>
              </Label>
              <Input
                id="workingHoursSaturday"
                required
                value={formData.workingHoursSaturday}
                onChange={(e) => handleChange("workingHoursSaturday", e.target.value)}
              />
            </div>
          </div>

          {/* Sunday Open / Close Bool */}
          <div className="rounded-xl border p-4 bg-muted/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sundayOpen" className="text-sm font-semibold cursor-pointer">
                    Sunday Clinic Status
                  </Label>
                  <Badge variant={formData.sundayOpen ? "default" : "secondary"}>
                    {formData.sundayOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggle whether the clinic is open for patient appointments on Sundays.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 sm:pt-0">
                <Switch
                  id="sundayOpen"
                  checked={formData.sundayOpen}
                  onCheckedChange={(checked) => handleChange("sundayOpen", Boolean(checked))}
                />
              </div>
            </div>

            {formData.sundayOpen && (
              <div className="mt-4 pt-3 border-t border-border/60">
                <div className="space-y-2 max-w-sm">
                  <Label htmlFor="workingHoursSunday">Sunday Working Hours</Label>
                  <Input
                    id="workingHoursSunday"
                    value={formData.workingHoursSunday}
                    onChange={(e) => handleChange("workingHoursSunday", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Section 4: Social Links & Google Maps ─────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            Social Profiles &amp; Google Map Link
          </CardTitle>
          <CardDescription>
            Configure social media profile handles and clinic map location URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Facebook */}
          <div className="space-y-1.5">
            <Label htmlFor="facebook">Facebook :</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://facebook.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Instagram */}
          <div className="space-y-1.5">
            <Label htmlFor="instagram">Instagram :</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://instagram.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Linkedin */}
          <div className="space-y-1.5">
            <Label htmlFor="linkedin">Linkedin :</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://linkedin.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Twitter */}
          <div className="space-y-1.5">
            <Label htmlFor="twitter">Twitter :</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://x.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Pinterest */}
          <div className="space-y-1.5">
            <Label htmlFor="pinterest">Pinterest :</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://pinterest.com/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="pinterest"
                value={formData.pinterest}
                onChange={(e) => handleChange("pinterest", e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Google Maps Link */}
          <div className="space-y-1.5">
            <Label htmlFor="mapLink">Map Link :</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://www.google.com/maps/</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="mapLink"
                value={formData.mapLink}
                onChange={(e) => handleChange("mapLink", e.target.value)}
              />
            </InputGroup>
          </div>
        </CardContent>
      </Card>

      {/* ── Actions Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={loading}
          className="gap-1.5"
        >
          <RotateCcw className="h-4 w-4" />
          Discard Changes
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="gap-1.5 px-6 font-medium shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
