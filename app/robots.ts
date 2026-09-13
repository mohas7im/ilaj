import type { MetadataRoute } from "next"
import { getCommonSeo } from "@/app/admin/seo/_services/seo.service"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteUrl } = await getCommonSeo()
  const baseUrl = siteUrl.replace(/\/$/, "")

  return {
    rules: [
      {
        // Allow crawlers on all public pages
        userAgent: "*",
        allow: "/",
        // Disallow admin, API, and other private routes
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
