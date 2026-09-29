import { prisma } from "@/lib/prisma"
import type { AllSeo, CommonSeo, PageSeo } from "@/domain/seo/seo.types"
import { PAGE_OPTIONS } from "@/domain/seo/seo.types"

const COMMON_SEO_SINGLETON_ID = "common_seo_singleton"

// Shown the first time a fresh DB has no CommonSeo row yet.
const DEFAULT_COMMON_SEO: Omit<CommonSeo, never> = {
  siteName: "Ilaj Dental Clinic",
  siteUrl: "https://ilajdental.com",
  defaultTitle: "Ilaj Dental Clinic | Expert Dental Care",
  defaultDescription:
    "Ilaj Dental Clinic offers professional dental care including teeth cleaning, whitening, braces, implants and more in Lahore, Pakistan.",
  defaultOgImage: "",
  googleVerification: "",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToCommonSeo(item: any): CommonSeo {
  return {
    siteName: item.siteName ?? "",
    siteUrl: item.siteUrl ?? "",
    defaultTitle: item.defaultTitle ?? "",
    defaultDescription: item.defaultDescription ?? "",
    defaultOgImage: item.defaultOgImage ?? "",
    googleVerification: item.googleVerification ?? "",
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToPageSeo(item: any, page: string): PageSeo {
  return {
    page,
    title: item?.title ?? "",
    description: item?.description ?? "",
    ogImage: item?.ogImage ?? "",
  }
}

// ─── Common SEO Operations ────────────────────────────────────────────────────

export async function getCommonSeo(): Promise<CommonSeo> {
  let seo = await prisma.commonSeo.findFirst()
  if (!seo) {
    seo = await prisma.commonSeo.create({
      data: {
        id: COMMON_SEO_SINGLETON_ID,
        ...DEFAULT_COMMON_SEO,
      },
    })
  }
  return mapToCommonSeo(seo)
}

export async function updateCommonSeo(data: Partial<CommonSeo>): Promise<CommonSeo> {
  const existing = await prisma.commonSeo.findFirst()
  const targetId = existing?.id ?? COMMON_SEO_SINGLETON_ID

  const updateData = {
    ...(data.siteName !== undefined && { siteName: data.siteName }),
    ...(data.siteUrl !== undefined && { siteUrl: data.siteUrl }),
    ...(data.defaultTitle !== undefined && { defaultTitle: data.defaultTitle }),
    ...(data.defaultDescription !== undefined && { defaultDescription: data.defaultDescription }),
    ...(data.defaultOgImage !== undefined && { defaultOgImage: data.defaultOgImage }),
    ...(data.googleVerification !== undefined && { googleVerification: data.googleVerification }),
  }

  const seo = await prisma.commonSeo.upsert({
    where: { id: targetId },
    create: { id: targetId, ...DEFAULT_COMMON_SEO, ...updateData },
    update: updateData,
  })
  return mapToCommonSeo(seo)
}

// ─── Page SEO Operations ──────────────────────────────────────────────────────

export async function getPageSeo(page: string): Promise<PageSeo> {
  const seo = await prisma.pageSeo.findUnique({ where: { page } })
  return mapToPageSeo(seo, page)
}

export async function updatePageSeo(page: string, data: Partial<PageSeo>): Promise<PageSeo> {
  const updateData = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.ogImage !== undefined && { ogImage: data.ogImage }),
  }

  const seo = await prisma.pageSeo.upsert({
    where: { page },
    create: {
      page,
      title: data.title ?? "",
      description: data.description ?? "",
      ogImage: data.ogImage ?? "",
    },
    update: updateData,
  })
  return mapToPageSeo(seo, page)
}

// ─── Batch Operation ──────────────────────────────────────────────────────────
// Common + every page's SEO in one round trip — used by the admin SEO screen,
// which otherwise would fire one request per PAGE_OPTIONS entry.

export async function getAllSeo(): Promise<AllSeo> {
  const [common, pageRows] = await Promise.all([
    getCommonSeo(),
    prisma.pageSeo.findMany({
      where: { page: { in: PAGE_OPTIONS.map((opt) => opt.value) } },
    }),
  ])

  const rowsByPage = Object.fromEntries(pageRows.map((row) => [row.page, row]))
  const pages = Object.fromEntries(
    PAGE_OPTIONS.map((opt) => [opt.value, mapToPageSeo(rowsByPage[opt.value], opt.value)])
  )

  return { common, pages }
}
