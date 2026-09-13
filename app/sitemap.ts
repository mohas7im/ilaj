import type { MetadataRoute } from "next"
import { getCommonSeo } from "@/app/admin/seo/_services/seo.service"

// ─── Public pages included in the sitemap ────────────────────────────────────
// Only actual public website routes — no admin, API, or private routes.

const PUBLIC_ROUTES = [
  { path: "/",              changeFrequency: "weekly",  priority: 1.0 },
  { path: "/about",         changeFrequency: "monthly", priority: 0.8 },
  { path: "/services",      changeFrequency: "monthly", priority: 0.9 },
  { path: "/doctors",       changeFrequency: "monthly", priority: 0.8 },
  { path: "/gallery",       changeFrequency: "monthly", priority: 0.6 },
  { path: "/testimonials",  changeFrequency: "monthly", priority: 0.6 },
  { path: "/why-choose-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact",       changeFrequency: "monthly", priority: 0.8 },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = await getCommonSeo()
  const baseUrl = siteUrl.replace(/\/$/, "")
  const lastModified = new Date()

  return PUBLIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
