import { z } from "zod"
import { PAGE_OPTIONS } from "@/domain/seo/seo.types"

const validPageSlugs = PAGE_OPTIONS.map((p) => p.value) as [string, ...string[]]

// ─── Common SEO Schema ────────────────────────────────────────────────────────

export const commonSeoSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteUrl: z
    .string()
    .min(1, "Site URL is required")
    .url("Site URL must be a valid URL (e.g. https://example.com)"),
  defaultTitle: z.string().min(1, "Default SEO title is required"),
  defaultDescription: z.string().optional().default(""),
  defaultOgImage: z.string().optional().default(""),
  googleVerification: z.string().optional().default(""),
  bingVerification: z.string().optional().default(""),
})

export type CommonSeoFormData = z.infer<typeof commonSeoSchema>

// ─── Page SEO Schema ──────────────────────────────────────────────────────────

export const pageSeoSchema = z.object({
  page: z.enum(validPageSlugs, { error: "Invalid page identifier" }),
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
})

export type PageSeoFormData = z.infer<typeof pageSeoSchema>
