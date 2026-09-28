"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Globe,
  Search,
  FileText,
  ImageIcon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ExternalLink,
  Upload,
  X,
  Save,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card"
import { LoadingState } from "@/components/admin/ui/loading-state"
import { Input } from "@/components/admin/ui/input"
import { Textarea } from "@/components/admin/ui/textarea"
import { Label } from "@/components/admin/ui/label"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { Spinner } from "@/components/admin/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import type { CommonSeo, PageSeo } from "@/domain/seo/seo.types"
import { PAGE_OPTIONS } from "@/domain/seo/seo.types"
import { commonSeoSchema, pageSeoSchema, type CommonSeoFormData, type PageSeoFormData } from "@/domain/seo/seo.schema"
import { seoApiService } from "../_services/seo.api"
import { getApiErrorMessage } from "@/lib/api/errors"

// ─── Props ────────────────────────────────────────────────────────────────────

type SeoFormProps = {
  initialCommonSeo: CommonSeo
  initialPageSeoMap: Record<string, PageSeo>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CharCounter({
  value,
  min,
  max,
}: {
  value: string
  min: number
  max: number
}) {
  const len = value.length
  const isGood = len >= min && len <= max
  const isOver = len > max
  const color = isOver
    ? "text-destructive"
    : isGood
    ? "text-green-600 dark:text-green-500"
    : "text-muted-foreground"

  return (
    <span className={`text-xs tabular-nums ${color}`}>
      {len} / {max} chars
      {isGood && " ✓"}
      {isOver && " (too long)"}
      {!isOver && len > 0 && len < min && " (too short)"}
    </span>
  )
}

// ─── Image Uploader ──────────────────────────────────────────────────────────

function OgImageUploader({
  value,
  onChange,
  onFileSelect,
  isSubmitting,
}: {
  value: string
  onChange: (url: string) => void
  onFileSelect?: (file: File | null) => void
  isSubmitting?: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }
    onFileSelect?.(file)
    onChange(URL.createObjectURL(file))
  }

  const handleRemove = () => {
    onFileSelect?.(null)
    onChange("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-3 p-4 rounded-lg border border-dashed border-border bg-muted/20">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border bg-muted/40 max-w-xs">
        {value ? (
          <img src={value} alt="OG image preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">1200 × 630 recommended</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isSubmitting}
          aria-label="Upload OG image"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isSubmitting}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          {value ? "Change Image" : "Upload Image"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Remove
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        JPG, PNG or WebP · Max 10 MB · Recommended: 1200 × 630 px
      </p>
    </div>
  )
}

// ─── SEO Preview ──────────────────────────────────────────────────────────────

function SeoPreview({
  title,
  description,
  url,
  ogImage,
}: {
  title: string
  description: string
  url: string
  ogImage: string
}) {
  const displayTitle = title || "Untitled page"
  const displayDesc  = description || "No description provided."
  const displayUrl   = url || "https://example.com"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Eye className="h-4 w-4 text-muted-foreground" />
          SEO Preview
        </CardTitle>
        <CardDescription className="text-xs">
          Approximate appearance in search results. Actual display may vary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search result preview */}
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Search Preview
          </p>
          <p className="text-[10px] text-green-700 dark:text-green-500 mb-0.5 truncate">{displayUrl}</p>
          <p className="text-base font-medium text-blue-700 dark:text-blue-400 leading-tight line-clamp-1">
            {displayTitle}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>

        {/* Social / OG preview */}
        {ogImage && (
          <div className="rounded-lg border border-border overflow-hidden max-w-xs">
            <p className="text-xs text-muted-foreground px-3 pt-2 pb-1">Social Preview</p>
            <img
              src={ogImage}
              alt="Social sharing preview"
              className="w-full aspect-video object-cover"
            />
            <div className="px-3 py-2 bg-muted/30">
              <p className="text-xs text-muted-foreground truncate">{displayUrl}</p>
              <p className="text-sm font-medium leading-tight line-clamp-1">{displayTitle}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{displayDesc}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── SEO Health ───────────────────────────────────────────────────────────────

type HealthItem = {
  label: string
  pass: boolean
  warning?: boolean
  message?: string
}

function SeoHealth({
  items,
}: {
  items: HealthItem[]
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          SEO Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-start gap-2 text-sm">
              {item.pass ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
              ) : item.warning ? (
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              )}
              <span className={item.pass ? "text-foreground" : item.warning ? "text-yellow-700 dark:text-yellow-400" : "text-muted-foreground"}>
                {item.label}
                {item.message && (
                  <span className="ml-1 text-xs text-muted-foreground">— {item.message}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// ─── SeoForm ──────────────────────────────────────────────────────────────────

export function SeoForm() {
  const [initialCommonSeo, setInitialCommonSeo] = useState<CommonSeo | null>(null)
  const [initialPageSeoMap, setInitialPageSeoMap] = useState<Record<string, PageSeo> | null>(null)

  useEffect(() => {
    seoApiService
      .getCommon()
      .then(setInitialCommonSeo)
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load SEO settings")))

    Promise.all(
      PAGE_OPTIONS.map((opt) =>
        seoApiService.getPage(opt.value).then((seo) => [opt.value, seo] as const)
      )
    )
      .then((entries) => setInitialPageSeoMap(Object.fromEntries(entries)))
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load page SEO settings")))
  }, [])

  if (!initialCommonSeo || !initialPageSeoMap) {
    return (
      <Card>
        <CardContent>
          <LoadingState spinner label="Loading SEO settings..." />
        </CardContent>
      </Card>
    )
  }

  return <SeoFormFields initialCommonSeo={initialCommonSeo} initialPageSeoMap={initialPageSeoMap} />
}

function SeoFormFields({ initialCommonSeo, initialPageSeoMap }: SeoFormProps) {
  const [selectedPage, setSelectedPage] = useState<string>("common")
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  
  // Track files
  const [commonOgFile, setCommonOgFile] = useState<File | null>(null)
  const [pageOgFiles, setPageOgFiles] = useState<Record<string, File | null>>({})

  // Track initial state updates so we can reset cleanly
  const [currentCommonInitial, setCurrentCommonInitial] = useState(initialCommonSeo)
  const [currentPageSeoMap, setCurrentPageSeoMap] = useState(initialPageSeoMap)

  const commonForm = useForm<CommonSeoFormData>({
    resolver: zodResolver(commonSeoSchema) as any,
    defaultValues: { ...initialCommonSeo },
  })

  const pageForm = useForm<PageSeoFormData>({
    resolver: zodResolver(pageSeoSchema) as any,
    defaultValues: {
      page: "home",
      title: "",
      description: "",
      ogImage: "",
    },
  })

  // When selectedPage changes, reset the page form to the correct values
  useEffect(() => {
    if (selectedPage !== "common") {
      const data = currentPageSeoMap[selectedPage] ?? { page: selectedPage, title: "", description: "", ogImage: "" }
      pageForm.reset({
        page: selectedPage as any,
        title: data.title ?? "",
        description: data.description ?? "",
        ogImage: data.ogImage ?? "",
      })
    }
    setSuccess(false)
    setApiError(null)
  }, [selectedPage, currentPageSeoMap, pageForm])

  const onCommonSubmit = async (data: CommonSeoFormData) => {
    setApiError(null)
    setSuccess(false)
    try {
      if (commonOgFile) {
        const formData = new FormData()
        formData.append("siteName", data.siteName)
        formData.append("siteUrl", data.siteUrl)
        formData.append("defaultTitle", data.defaultTitle)
        formData.append("defaultDescription", data.defaultDescription ?? "")
        formData.append("googleVerification", data.googleVerification ?? "")
        formData.append("bingVerification", data.bingVerification ?? "")
        formData.append("defaultOgImage", commonOgFile)
        await seoApiService.updateCommon(formData)
      } else {
        await seoApiService.updateCommon(data as CommonSeo)
      }
      
      setCurrentCommonInitial(data as CommonSeo)
      setSuccess(true)
      toast.success("SEO settings saved successfully")
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to save SEO settings")
      setApiError(msg)
      toast.error(msg)
    }
  }

  const onPageSubmit = async (data: PageSeoFormData) => {
    setApiError(null)
    setSuccess(false)
    try {
      const pageFile = pageOgFiles[selectedPage]
      if (pageFile) {
        const formData = new FormData()
        formData.append("title", data.title ?? "")
        formData.append("description", data.description ?? "")
        formData.append("ogImage", pageFile)
        await seoApiService.updatePage(selectedPage, formData)
      } else {
        await seoApiService.updatePage(
          selectedPage,
          { ...data, page: selectedPage } as PageSeo
        )
      }

      setCurrentPageSeoMap(prev => ({
        ...prev,
        [selectedPage]: { ...data, page: selectedPage } as PageSeo
      }))
      setSuccess(true)
      toast.success("SEO settings saved successfully")
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to save SEO settings")
      setApiError(msg)
      toast.error(msg)
    }
  }

  const handleReset = () => {
    if (selectedPage === "common") {
      commonForm.reset(currentCommonInitial)
      setCommonOgFile(null)
    } else {
      const data = currentPageSeoMap[selectedPage] ?? { page: selectedPage, title: "", description: "", ogImage: "" }
      pageForm.reset({
        page: selectedPage as any,
        title: data.title ?? "",
        description: data.description ?? "",
        ogImage: data.ogImage ?? "",
      })
      setPageOgFiles(prev => ({ ...prev, [selectedPage]: null }))
    }
    setSuccess(false)
    setApiError(null)
  }

  const isSubmitting = selectedPage === "common" ? commonForm.formState.isSubmitting : pageForm.formState.isSubmitting

  // Live watch for preview and health
  const commonWatch = commonForm.watch()
  const pageWatch = pageForm.watch()

  const effectiveTitle = selectedPage === "common"
    ? commonWatch.defaultTitle || ""
    : pageWatch.title || commonWatch.defaultTitle || ""
  const effectiveDesc = selectedPage === "common"
    ? commonWatch.defaultDescription || ""
    : pageWatch.description || commonWatch.defaultDescription || ""
  const effectiveOg = selectedPage === "common"
    ? commonWatch.defaultOgImage || ""
    : pageWatch.ogImage || commonWatch.defaultOgImage || ""

  const pageOption = PAGE_OPTIONS.find((p) => p.value === selectedPage)
  const canonicalUrl =
    selectedPage === "common"
      ? commonWatch.siteUrl || ""
      : `${(commonWatch.siteUrl || "").replace(/\/$/, "")}${pageOption?.path ?? ""}`

  // Health checks
  const healthItems: HealthItem[] = selectedPage === "common"
    ? [
        {
          label: "Site Name configured",
          pass: Boolean(commonWatch.siteName),
          message: commonWatch.siteName ? undefined : "Enter a site name",
        },
        {
          label: "Site URL configured",
          pass: Boolean(commonWatch.siteUrl),
          message: commonWatch.siteUrl ? undefined : "Enter the public URL of your website",
        },
        {
          label: "Default SEO title configured",
          pass: Boolean(commonWatch.defaultTitle),
          message: commonWatch.defaultTitle ? undefined : "Enter a default title used as fallback",
        },
        {
          label: "Default SEO title length",
          pass: (commonWatch.defaultTitle?.length || 0) >= 50 && (commonWatch.defaultTitle?.length || 0) <= 60,
          warning: (commonWatch.defaultTitle?.length || 0) > 0 && ((commonWatch.defaultTitle?.length || 0) < 50 || (commonWatch.defaultTitle?.length || 0) > 60),
          message: !commonWatch.defaultTitle
            ? "No title entered"
            : commonWatch.defaultTitle.length < 50
            ? "Too short — aim for 50–60 characters"
            : commonWatch.defaultTitle.length > 60
            ? "Too long — trim to 60 characters"
            : undefined,
        },
        {
          label: "Default meta description configured",
          pass: Boolean(commonWatch.defaultDescription),
          warning: !commonWatch.defaultDescription,
          message: commonWatch.defaultDescription ? undefined : "Enter a default description used as fallback",
        },
        {
          label: "Default meta description length",
          pass: (commonWatch.defaultDescription?.length || 0) >= 150 && (commonWatch.defaultDescription?.length || 0) <= 160,
          warning: (commonWatch.defaultDescription?.length || 0) > 0 && ((commonWatch.defaultDescription?.length || 0) < 150 || (commonWatch.defaultDescription?.length || 0) > 160),
          message: !commonWatch.defaultDescription
            ? "No description entered"
            : commonWatch.defaultDescription.length < 150
            ? "Too short — aim for 150–160 characters"
            : commonWatch.defaultDescription.length > 160
            ? "Too long — trim to 160 characters"
            : undefined,
        },
        {
          label: "Default OG image configured",
          pass: Boolean(commonWatch.defaultOgImage),
          warning: !commonWatch.defaultOgImage,
          message: commonWatch.defaultOgImage ? undefined : "Upload a default social sharing image",
        },
      ]
    : [
        {
          label: "SEO title configured",
          pass: Boolean(effectiveTitle),
          warning: !pageWatch.title && Boolean(commonWatch.defaultTitle),
          message: pageWatch.title
            ? undefined
            : commonWatch.defaultTitle
            ? "Using global default title"
            : "No title — enter a page title or configure a global default",
        },
        {
          label: "SEO title length",
          pass: effectiveTitle.length >= 50 && effectiveTitle.length <= 60,
          warning: effectiveTitle.length > 0 && (effectiveTitle.length < 50 || effectiveTitle.length > 60),
          message: effectiveTitle.length < 50
            ? "Too short — aim for 50–60 characters"
            : effectiveTitle.length > 60
            ? "Too long — trim to 60 characters"
            : undefined,
        },
        {
          label: "Meta description configured",
          pass: Boolean(effectiveDesc),
          warning: !pageWatch.description && Boolean(commonWatch.defaultDescription),
          message: pageWatch.description
            ? undefined
            : commonWatch.defaultDescription
            ? "Using global default description"
            : "No description — enter a page description or configure a global default",
        },
        {
          label: "Meta description length",
          pass: effectiveDesc.length >= 150 && effectiveDesc.length <= 160,
          warning: effectiveDesc.length > 0 && (effectiveDesc.length < 150 || effectiveDesc.length > 160),
          message: effectiveDesc.length < 150
            ? "Too short — aim for 150–160 characters"
            : effectiveDesc.length > 160
            ? "Too long — trim to 160 characters"
            : undefined,
        },
        {
          label: "Canonical URL generated",
          pass: Boolean(commonWatch.siteUrl),
          message: commonWatch.siteUrl
            ? canonicalUrl
            : "Configure the Site URL in Common SEO to generate canonical URLs",
        },
        {
          label: "OG image configured",
          pass: Boolean(effectiveOg),
          warning: !pageWatch.ogImage && Boolean(commonWatch.defaultOgImage),
          message: pageWatch.ogImage
            ? undefined
            : commonWatch.defaultOgImage
            ? "Using global default OG image"
            : "No OG image — upload one or set a global default",
        },
      ]

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPage === "common") {
      commonForm.handleSubmit(onCommonSubmit)(e)
    } else {
      pageForm.handleSubmit(onPageSubmit)(e)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* ── Status banner */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 px-4 py-3 text-sm text-green-800 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          SEO settings saved successfully.
        </div>
      )}
      {apiError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <XCircle className="h-4 w-4 shrink-0" />
          {apiError}
        </div>
      )}

      {/* ── Page Selector */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Label htmlFor="page-select" className="shrink-0 text-sm font-medium">
              Select Page
            </Label>
            <div className="w-full sm:max-w-xs">
              <Select
                value={selectedPage}
                onValueChange={(v) => {
                  if (v) {
                    setSelectedPage(v)
                  }
                }}
              >
                <SelectTrigger id="page-select" aria-label="Select page to edit SEO">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="common">Common (Global Defaults)</SelectItem>
                  {PAGE_OPTIONS.map((page) => (
                    <SelectItem key={page.value} value={page.value}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPage !== "common" && commonWatch.siteUrl && (
              <span className="text-xs text-muted-foreground font-mono">
                {(commonWatch.siteUrl || "").replace(/\/$/, "")}{pageOption?.path}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════════
          COMMON SEO
      ═══════════════════════════════════════════════════════════════════════ */}
      {selectedPage === "common" && (
        <>
          {/* General SEO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4 text-muted-foreground" />
                General SEO
              </CardTitle>
              <CardDescription>
                These values act as the global defaults for all public pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Site Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="siteName">
                    Site Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="siteName"
                    {...commonForm.register("siteName")}
                    aria-invalid={!!commonForm.formState.errors.siteName}
                  />
                  {commonForm.formState.errors.siteName && <p className="text-xs text-destructive">{commonForm.formState.errors.siteName.message}</p>}
                </div>

                {/* Site URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="siteUrl">
                    Site URL <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="siteUrl"
                    type="url"
                    {...commonForm.register("siteUrl")}
                    aria-invalid={!!commonForm.formState.errors.siteUrl}
                  />
                  {commonForm.formState.errors.siteUrl && <p className="text-xs text-destructive">{commonForm.formState.errors.siteUrl.message}</p>}
                </div>

                {/* Default SEO Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="defaultTitle">
                      Default SEO Title <span className="text-destructive">*</span>
                    </Label>
                    <CharCounter value={commonWatch.defaultTitle || ""} min={50} max={60} />
                  </div>
                  <Input
                    id="defaultTitle"
                    {...commonForm.register("defaultTitle")}
                    aria-invalid={!!commonForm.formState.errors.defaultTitle}
                  />
                  {commonForm.formState.errors.defaultTitle && <p className="text-xs text-destructive">{commonForm.formState.errors.defaultTitle.message}</p>}
                  <p className="text-xs text-muted-foreground">Recommended: 50–60 characters.</p>
                </div>

                {/* Default Meta Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="defaultDescription">Default Meta Description</Label>
                    <CharCounter value={commonWatch.defaultDescription || ""} min={150} max={160} />
                  </div>
                  <Textarea
                    id="defaultDescription"
                    {...commonForm.register("defaultDescription")}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Recommended: 150–160 characters.</p>
                </div>
              </div>

              {/* Default OG Image */}
              <div className="space-y-1.5">
                <Label>Default OG Image</Label>
                <p className="text-xs text-muted-foreground">
                  Used as the social sharing image for pages that do not have their own OG image.
                </p>
                <OgImageUploader
                  value={commonWatch.defaultOgImage || ""}
                  onChange={(url) => commonForm.setValue("defaultOgImage", url, { shouldValidate: true })}
                  onFileSelect={(file) => setCommonOgFile(file)}
                  isSubmitting={commonForm.formState.isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Search Engine Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="h-4 w-4 text-muted-foreground" />
                Search Engine Verification
              </CardTitle>
              <CardDescription>
                Paste the verification codes provided by search engine tools (optional).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="googleVerification">Google Search Console Verification</Label>
                  <Input
                    id="googleVerification"
                    {...commonForm.register("googleVerification")}
                  />
                  <p className="text-xs text-muted-foreground">
                    The content value from the Google verification meta tag.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bingVerification">Bing Webmaster Verification</Label>
                  <Input
                    id="bingVerification"
                    {...commonForm.register("bingVerification")}
                  />
                  <p className="text-xs text-muted-foreground">
                    The content value from the Bing verification meta tag.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PAGE SEO
      ═══════════════════════════════════════════════════════════════════════ */}
      {selectedPage !== "common" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Page SEO
                <Badge variant="outline" className="ml-1 text-xs font-normal">
                  {pageOption?.label}
                </Badge>
              </CardTitle>
              <CardDescription>
                Override the global defaults for this specific page. Leave fields empty to use global defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* SEO Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pageTitle">SEO Title</Label>
                  <CharCounter value={pageWatch.title || ""} min={50} max={60} />
                </div>
                <Input
                  id="pageTitle"
                  {...pageForm.register("title")}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 50–60 characters.{" "}
                  {!pageWatch.title && commonWatch.defaultTitle && (
                    <span className="text-yellow-600 dark:text-yellow-500">
                      Empty → using global default: &ldquo;{commonWatch.defaultTitle}&rdquo;
                    </span>
                  )}
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pageDescription">Meta Description</Label>
                  <CharCounter value={pageWatch.description || ""} min={150} max={160} />
                </div>
                <Textarea
                  id="pageDescription"
                  {...pageForm.register("description")}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 150–160 characters.{" "}
                  {!pageWatch.description && commonWatch.defaultDescription && (
                    <span className="text-yellow-600 dark:text-yellow-500">
                      Empty → using global default description.
                    </span>
                  )}
                </p>
              </div>

              {/* Canonical URL (auto-generated, read-only info) */}
              {commonWatch.siteUrl && (
                <div className="space-y-1.5 rounded-lg bg-muted/30 border border-border/60 p-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Auto-Generated Canonical URL
                  </p>
                  <p className="font-mono text-sm text-foreground break-all">
                    {canonicalUrl}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Canonical URLs are generated automatically from the Site URL. No manual input required.
                  </p>
                </div>
              )}

              {/* OG Image */}
              <div className="space-y-1.5">
                <Label>OG Image</Label>
                <p className="text-xs text-muted-foreground">
                  Social sharing image for this page.{" "}
                  {!pageWatch.ogImage && commonWatch.defaultOgImage && (
                    <span className="text-yellow-600 dark:text-yellow-500">
                      Empty → using global default OG image.
                    </span>
                  )}
                </p>
                <OgImageUploader
                  value={pageWatch.ogImage || ""}
                  onChange={(url) => pageForm.setValue("ogImage", url, { shouldValidate: true })}
                  onFileSelect={(file) => setPageOgFiles((prev) => ({ ...prev, [selectedPage]: file }))}
                  isSubmitting={pageForm.formState.isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Preview */}
          <SeoPreview
            title={effectiveTitle}
            description={effectiveDesc}
            url={canonicalUrl}
            ogImage={effectiveOg}
          />
        </>
      )}

      {/* SEO Health — shown for all selections */}
      <SeoHealth items={healthItems} />

      {/* ── Action bar */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="mr-1.5 size-3.5" />
              Saving…
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
