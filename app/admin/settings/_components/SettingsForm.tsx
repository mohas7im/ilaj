"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Spinner } from "@/components/admin/ui/spinner"
import type { ClinicSettings } from "@/domain/settings/settings.types"
import { settingsSchema, type SettingsFormData } from "@/domain/settings/settings.schema"
import { settingsApiService } from "../_services/settings.api"
import { getApiErrorMessage } from "@/lib/api/errors"
import { LoadingState } from "@/components/admin/ui/loading-state"

export function SettingsForm() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null)

  useEffect(() => {
    let active = true
    settingsApiService
      .get()
      .then((data) => {
        if (active) setSettings(data)
      })
      .catch((err) => {
        if (active) toast.error(getApiErrorMessage(err, "Failed to load settings"))
      })
    return () => {
      active = false
    }
  }, [])

  if (!settings) {
    return (
      <Card className="max-w-4xl w-full mx-auto">
        <CardContent>
          <LoadingState spinner label="Loading settings..." />
        </CardContent>
      </Card>
    )
  }

  return <SettingsFormFields initialSettings={settings} />
}

function SettingsFormFields({ initialSettings }: { initialSettings: ClinicSettings }) {

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as any,
    defaultValues: {
      ...initialSettings,
      secondaryEmail: initialSettings.secondaryEmail ?? "",
      phone2: initialSettings.phone2 ?? "",
      whatsappNumber: initialSettings.whatsappNumber ?? "",
      workingHoursSunday: initialSettings.workingHoursSunday ?? "",
      facebook: initialSettings.facebook ?? "",
      instagram: initialSettings.instagram ?? "",
      linkedin: initialSettings.linkedin ?? "",
      twitter: initialSettings.twitter ?? "",
      pinterest: initialSettings.pinterest ?? "",
      mapLink: initialSettings.mapLink ?? "",
    },
  })

  const sundayOpen = watch("sundayOpen")

  const handleReset = () => {
    reset({
      ...initialSettings,
      secondaryEmail: initialSettings.secondaryEmail ?? "",
      phone2: initialSettings.phone2 ?? "",
      whatsappNumber: initialSettings.whatsappNumber ?? "",
      workingHoursSunday: initialSettings.workingHoursSunday ?? "",
      facebook: initialSettings.facebook ?? "",
      instagram: initialSettings.instagram ?? "",
      linkedin: initialSettings.linkedin ?? "",
      twitter: initialSettings.twitter ?? "",
      pinterest: initialSettings.pinterest ?? "",
      mapLink: initialSettings.mapLink ?? "",
    })
  }

  const onSubmit = async (data: SettingsFormData) => {

    try {
      // Create full object mapped back to ClinicSettings types if needed by API
      // The API should accept data that aligns with ClinicSettings or SettingsFormData
      const updated = await settingsApiService.update(data as unknown as ClinicSettings)
      
      reset({
        ...updated,
        secondaryEmail: updated.secondaryEmail ?? "",
        phone2: updated.phone2 ?? "",
        whatsappNumber: updated.whatsappNumber ?? "",
        workingHoursSunday: updated.workingHoursSunday ?? "",
        facebook: updated.facebook ?? "",
        instagram: updated.instagram ?? "",
        linkedin: updated.linkedin ?? "",
        twitter: updated.twitter ?? "",
        pinterest: updated.pinterest ?? "",
        mapLink: updated.mapLink ?? "",
      })
      toast.success("Settings saved successfully!")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to update settings")
      toast.error(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl w-full mx-auto" noValidate>
      {/* Top Banner Alert */}



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
                {...register("primaryEmail")}
                aria-invalid={!!errors.primaryEmail}
              />
              {errors.primaryEmail && <p className="text-xs text-destructive">{errors.primaryEmail.message}</p>}
            </div>

            {/* Secondary Email */}
            <div className="space-y-2">
              <Label htmlFor="secondaryEmail">Secondary Email</Label>
              <Input
                id="secondaryEmail"
                type="email"
                {...register("secondaryEmail")}
                aria-invalid={!!errors.secondaryEmail}
              />
              {errors.secondaryEmail && <p className="text-xs text-destructive">{errors.secondaryEmail.message}</p>}
            </div>

            {/* Phone Number 1 */}
            <div className="space-y-2">
              <Label htmlFor="phone1">
                Phone Number 1 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone1"
                type="tel"
                {...register("phone1")}
                aria-invalid={!!errors.phone1}
              />
              {errors.phone1 && <p className="text-xs text-destructive">{errors.phone1.message}</p>}
            </div>

            {/* Phone Number 2 */}
            <div className="space-y-2">
              <Label htmlFor="phone2">Phone Number 2</Label>
              <Input
                id="phone2"
                type="tel"
                {...register("phone2")}
                aria-invalid={!!errors.phone2}
              />
              {errors.phone2 && <p className="text-xs text-destructive">{errors.phone2.message}</p>}
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
                {...register("whatsappNumber")}
                aria-invalid={!!errors.whatsappNumber}
              />
              {errors.whatsappNumber && <p className="text-xs text-destructive">{errors.whatsappNumber.message}</p>}
            </div>

            {/* Address Textarea */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address" className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Address <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="address"
                rows={3}
                {...register("address")}
                aria-invalid={!!errors.address}
              />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
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
                {...register("yearsOfExperience")}
                aria-invalid={!!errors.yearsOfExperience}
              />
              {errors.yearsOfExperience && <p className="text-xs text-destructive">{errors.yearsOfExperience.message}</p>}
            </div>

            {/* Total Patients */}
            <div className="space-y-2">
              <Label htmlFor="totalPatients">
                Total Patients <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalPatients"
                {...register("totalPatients")}
                aria-invalid={!!errors.totalPatients}
              />
              {errors.totalPatients && <p className="text-xs text-destructive">{errors.totalPatients.message}</p>}
            </div>

            {/* Specialists */}
            <div className="space-y-2">
              <Label htmlFor="specialists">
                Specialists <span className="text-destructive">*</span>
              </Label>
              <Input
                id="specialists"
                {...register("specialists")}
                aria-invalid={!!errors.specialists}
              />
              {errors.specialists && <p className="text-xs text-destructive">{errors.specialists.message}</p>}
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
                {...register("workingHoursWeekday")}
                aria-invalid={!!errors.workingHoursWeekday}
              />
              {errors.workingHoursWeekday && <p className="text-xs text-destructive">{errors.workingHoursWeekday.message}</p>}
            </div>

            {/* Saturday Working Time */}
            <div className="space-y-2">
              <Label htmlFor="workingHoursSaturday">
                Saturday Hours <span className="text-destructive">*</span>
              </Label>
              <Input
                id="workingHoursSaturday"
                {...register("workingHoursSaturday")}
                aria-invalid={!!errors.workingHoursSaturday}
              />
              {errors.workingHoursSaturday && <p className="text-xs text-destructive">{errors.workingHoursSaturday.message}</p>}
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
                  <Badge variant={sundayOpen ? "default" : "secondary"}>
                    {sundayOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Toggle whether the clinic is open for patient appointments on Sundays.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 sm:pt-0">
                <Controller
                  control={control}
                  name="sundayOpen"
                  render={({ field }) => (
                    <Switch
                      id="sundayOpen"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {sundayOpen && (
              <div className="mt-4 pt-3 border-t border-border/60">
                <div className="space-y-2 max-w-sm">
                  <Label htmlFor="workingHoursSunday">Sunday Working Hours</Label>
                  <Input
                    id="workingHoursSunday"
                    {...register("workingHoursSunday")}
                    aria-invalid={!!errors.workingHoursSunday}
                  />
                  {errors.workingHoursSunday && <p className="text-xs text-destructive">{errors.workingHoursSunday.message}</p>}
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
                {...register("facebook")}
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
                {...register("instagram")}
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
                {...register("linkedin")}
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
                {...register("twitter")}
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
                {...register("pinterest")}
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
                {...register("mapLink")}
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
          disabled={isSubmitting}
          className="gap-1.5"
        >
          <RotateCcw className="h-4 w-4" />
          Discard Changes
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-1.5 px-6 font-medium shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-1 h-4 w-4" />
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
