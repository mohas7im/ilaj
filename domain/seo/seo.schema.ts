import { z } from "zod"
import { PAGE_OPTIONS } from "@/domain/seo/seo.types"

const validPageSlugs = PAGE_OPTIONS.map((p) => p.value) as [string, ...string[]]

// ─── Common SEO Schema ────────────────────────────────────────────────────────

// Accepts either the bare code or the whole tag Google gives you
// (<meta name="google-site-verification" content="..." />) and keeps the code.
function toVerificationCode(value: string) {
  const match = value.match(/content=["']([^"']+)["']/)
  return (match ? match[1] : value).trim()
}

export const commonSeoSchema = z.object({
  siteName: z.string().trim().optional().default(""),
  siteUrl: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((value) => !value || /^https?:\/\/[^\s/]+$/.test(value.replace(/\/$/, "")), {
      message: "Enter the full domain only, e.g. https://ilajdental.com",
    }),
  defaultTitle: z.string().trim().optional().default(""),
  defaultDescription: z.string().trim().optional().default(""),
  defaultOgImage: z.string().optional().default(""),
  googleVerification: z.string().optional().default("").transform(toVerificationCode),
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
