import type { CommonSeo, PageSeo } from "../_types/seo.types"

// ─── Common / Global SEO ─────────────────────────────────────────────────────
// In-memory store — follows the same pattern as CLINIC_SETTINGS.

export let COMMON_SEO: CommonSeo = {
  siteName: "Ilaj Dental Clinic",
  siteUrl: "https://ilajdental.com",
  defaultTitle: "Ilaj Dental Clinic | Expert Dental Care",
  defaultDescription:
    "Ilaj Dental Clinic offers professional dental care including teeth cleaning, whitening, braces, implants and more in Lahore, Pakistan.",
  defaultOgImage: "",
  googleVerification: "",
  bingVerification: "",
}

// ─── Page-Specific SEO ────────────────────────────────────────────────────────
// Map of page slug → PageSeo data.

export let PAGE_SEO_MAP: Record<string, PageSeo> = {}

// ─── Common SEO Operations ────────────────────────────────────────────────────

export async function getCommonSeo(): Promise<CommonSeo> {
  return { ...COMMON_SEO }
}

export async function updateCommonSeo(data: Partial<CommonSeo>): Promise<CommonSeo> {
  COMMON_SEO = { ...COMMON_SEO, ...data }
  return { ...COMMON_SEO }
}

// ─── Page SEO Operations ──────────────────────────────────────────────────────

export async function getPageSeo(page: string): Promise<PageSeo> {
  return PAGE_SEO_MAP[page] ?? { page, title: "", description: "", ogImage: "" }
}

export async function updatePageSeo(page: string, data: Partial<PageSeo>): Promise<PageSeo> {
  PAGE_SEO_MAP[page] = {
    page,
    title:       data.title       ?? PAGE_SEO_MAP[page]?.title       ?? "",
    description: data.description ?? PAGE_SEO_MAP[page]?.description ?? "",
    ogImage:     data.ogImage     ?? PAGE_SEO_MAP[page]?.ogImage     ?? "",
  }
  return { ...PAGE_SEO_MAP[page] }
}
