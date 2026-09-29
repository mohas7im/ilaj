import type { Metadata } from "next"
import { getCommonSeo, getPageSeo } from "@/server/services/seo.service"
import { getClinicSettings } from "@/server/services/settings.service"
import { PAGE_OPTIONS, type CommonSeo } from "@/domain/seo/seo.types"

// Where each value comes from:
//   brand name   → SEO "Site Name", else Clinic Settings clinic name
//   page title   → page's SEO title, else the page label ("About"); the root
//                  layout appends " | <brand>" to every page except home
//   description  → page's description, else the SEO default description
//   OG image     → page's image, else the SEO default image

type SiteSeo = {
  common: CommonSeo
  siteName: string
  /** e.g. "https://example.com" (no trailing slash), "" when not configured */
  baseUrl: string
}

async function getSiteSeo(): Promise<SiteSeo> {
  const [common, settings] = await Promise.all([getCommonSeo(), getClinicSettings()])
  return {
    common,
    siteName: common.siteName || settings.clinicName || "",
    baseUrl: common.siteUrl.trim().replace(/\/+$/, ""),
  }
}

function toUrl(baseUrl: string): URL | undefined {
  try {
    return baseUrl ? new URL(baseUrl) : undefined
  } catch {
    return undefined
  }
}

// Google shows about 160 characters; cut long text at a word boundary.
function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(" ")) || cut}…`
}

type PageMetadataInput = {
  site: SiteSeo
  title: string
  /** Home page: use the title as-is, without the " | <brand>" suffix */
  absolute?: boolean
  description: string
  image: string
  imageAlt?: string
  path: string
}

// Next.js merges metadata shallowly, so every page sends complete
// openGraph / twitter objects rather than relying on the layout's.
function buildPageMetadata({
  site,
  title,
  absolute,
  description,
  image,
  imageAlt,
  path,
}: PageMetadataInput): Metadata {
  const { siteName, baseUrl } = site
  // Social cards don't apply the title template, so build the full title here
  const fullTitle = absolute || !siteName ? title : `${title} | ${siteName}`
  const url = baseUrl ? `${baseUrl}${path}` : undefined
  const images = image ? [{ url: image, alt: imageAlt || fullTitle }] : undefined

  return {
    title: absolute ? { absolute: title } : title,
    description: description || undefined,
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      type: "website",
      siteName: siteName || undefined,
      title: fullTitle,
      description: description || undefined,
      url,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description: description || undefined,
      images: image ? [image] : undefined,
    },
  }
}

// ─── generateRootMetadata ─────────────────────────────────────────────────────
// Website root layout: base URL, title template, defaults and verification.

export async function generateRootMetadata(): Promise<Metadata> {
  const site = await getSiteSeo()
  const { common, siteName } = site
  const defaultTitle = common.defaultTitle || siteName

  return {
    metadataBase: toUrl(site.baseUrl),
    applicationName: siteName || undefined,
    title: {
      default: defaultTitle,
      template: siteName ? `%s | ${siteName}` : "%s",
    },
    description: common.defaultDescription || undefined,
    openGraph: {
      type: "website",
      siteName: siteName || undefined,
      title: defaultTitle,
      description: common.defaultDescription || undefined,
      images: common.defaultOgImage ? [{ url: common.defaultOgImage }] : undefined,
    },
    twitter: {
      card: common.defaultOgImage ? "summary_large_image" : "summary",
    },
    robots: {
      index: true,
      follow: true,
    },
    ...(common.googleVerification && {
      verification: { google: common.googleVerification },
    }),
  }
}

// ─── generatePageMetadata ─────────────────────────────────────────────────────
// Call from a public page's generateMetadata(), with its PAGE_OPTIONS value:
//
//   export async function generateMetadata() {
//     return generatePageMetadata("about")
//   }

export async function generatePageMetadata(pageSlug: string): Promise<Metadata> {
  const [site, page] = await Promise.all([getSiteSeo(), getPageSeo(pageSlug)])
  const option = PAGE_OPTIONS.find((p) => p.value === pageSlug)
  const path = option?.path ?? `/${pageSlug}`
  const isHome = path === "/"

  const title = isHome
    ? page.title || site.common.defaultTitle || site.siteName
    : page.title || option?.label || site.siteName

  return buildPageMetadata({
    site,
    title,
    absolute: isHome,
    description: page.description || site.common.defaultDescription,
    image: page.ogImage || site.common.defaultOgImage,
    path,
  })
}

// ─── generateTreatmentMetadata ────────────────────────────────────────────────
// Treatment detail pages: SEO fields from the Service form, falling back to
// the treatment's name, description and primary image.

export async function generateTreatmentMetadata(service: {
  slug: string
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  image: string
  imageAlt: string
}): Promise<Metadata> {
  const site = await getSiteSeo()

  return buildPageMetadata({
    site,
    title: service.metaTitle || service.title,
    description: truncate(service.metaDescription || service.description || site.common.defaultDescription),
    image: service.image || site.common.defaultOgImage,
    imageAlt: service.imageAlt,
    path: `/treatments/${service.slug}`,
  })
}

// ─── Admin ────────────────────────────────────────────────────────────────────
// The admin panel is never indexed.

export async function generateAdminRootMetadata(): Promise<Metadata> {
  const { siteName } = await getSiteSeo()

  return {
    title: {
      default: siteName ? `Admin | ${siteName}` : "Admin",
      template: siteName ? `%s | ${siteName}` : "%s",
    },
    robots: { index: false, follow: false },
  }
}

export function generateAdminMetadata(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  }
}
