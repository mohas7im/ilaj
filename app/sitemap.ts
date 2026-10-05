import type { MetadataRoute } from "next"
import { getCommonSeo } from "@/server/services/seo.service"
import { getServices } from "@/server/services/service.service"
import { PAGE_OPTIONS } from "@/domain/seo/seo.types"

// ─── Public pages included in the sitemap ────────────────────────────────────
// The pages from the admin SEO screen, plus every active treatment page.
// No admin, API, or private routes.

type SitemapEntry = MetadataRoute.Sitemap[number]

const PAGE_SETTINGS: Record<string, Pick<SitemapEntry, "changeFrequency" | "priority">> = {
  "/":              { changeFrequency: "weekly",  priority: 1.0 },
  "/treatments":    { changeFrequency: "weekly",  priority: 0.9 },
  "/about":         { changeFrequency: "monthly", priority: 0.8 },
  "/doctors":       { changeFrequency: "monthly", priority: 0.8 },
  "/contact":       { changeFrequency: "monthly", priority: 0.8 },
  "/smile-gallery": { changeFrequency: "monthly", priority: 0.7 },
  "/gallery":       { changeFrequency: "monthly", priority: 0.6 },
  "/testimonials":  { changeFrequency: "monthly", priority: 0.6 },
  "/privacy":            { changeFrequency: "yearly", priority: 0.3 },
  "/terms":              { changeFrequency: "yearly", priority: 0.3 },
  "/medical-disclaimer": { changeFrequency: "yearly", priority: 0.3 },
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ siteUrl }, services] = await Promise.all([getCommonSeo(), getServices()])
  const baseUrl = siteUrl.replace(/\/$/, "")
  const lastModified = new Date()

  const pages: MetadataRoute.Sitemap = PAGE_OPTIONS.map(({ path }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
    ...PAGE_SETTINGS[path],
  }))

  const treatments: MetadataRoute.Sitemap = services
    .filter((service) => service.status === "active" && service.slug)
    .map((service) => ({
      url: `${baseUrl}/treatments/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }))

  return [...pages, ...treatments]
}
