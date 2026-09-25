import type { Metadata } from "next"
import { getCommonSeo, getPageSeo } from "@/server/services/seo.service"
import { getClinicSettings } from "@/server/services/settings.service"
import { PAGE_OPTIONS } from "@/domain/seo/seo.types"

// ─── getSeoForPage ────────────────────────────────────────────────────────────
// Applies the fallback chain:
//   page-specific value → global default → safe hardcoded fallback

export async function getSeoForPage(pageSlug: string) {
  const [common, page] = await Promise.all([
    getCommonSeo(),
    getPageSeo(pageSlug),
  ])

  const pageOption = PAGE_OPTIONS.find((p) => p.value === pageSlug)
  const pagePath   = pageOption?.path ?? `/${pageSlug}`
  const baseUrl    = common.siteUrl.replace(/\/$/, "")

  const title = page.title || common.defaultTitle || `${common.siteName}`
  const description = page.description || common.defaultDescription || ""
  const ogImage = page.ogImage || common.defaultOgImage || ""
  const canonical = `${baseUrl}${pagePath}`

  return { title, description, ogImage, canonical, common, page, pagePath }
}

// ─── generateRootMetadata ─────────────────────────────────────────────────────
// Shared by the website and admin root layouts: site-wide title template and
// description. Pages refine it with generatePageMetadata / generateAdminMetadata.

export async function generateRootMetadata(): Promise<Metadata> {
  const [common, settings] = await Promise.all([
    getCommonSeo(),
    getClinicSettings(),
  ])

  const siteName = settings.clinicName || common.siteName
  const description = settings.tagline || common.defaultDescription

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    robots: {
      index: true,
      follow: true,
    },
  }
}

// ─── generatePageMetadata ─────────────────────────────────────────────────────
// Call this from any public page's generateMetadata() export.
//
// Usage:
//   export async function generateMetadata() {
//     return generatePageMetadata("services")
//   }

export async function generatePageMetadata(pageSlug: string): Promise<Metadata> {
  const { title, description, ogImage, canonical, common } = await getSeoForPage(pageSlug)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: common.siteName,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      type: "website",
    },
    // All public pages are always index + follow — no admin control needed
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    // Verification tags — only rendered when configured
    ...(common.googleVerification
      ? { verification: { google: common.googleVerification } }
      : {}),
  }
}

// ─── generateAdminMetadata ────────────────────────────────────────────────────
// Used for admin pages — always noindex/nofollow.

export function generateAdminMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  }
}
