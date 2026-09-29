import { apiClient } from "@/lib/api/client"
import { ENDPOINTS } from "@/lib/api/endpoints"
import type { AllSeo, CommonSeo, PageSeo } from "@/domain/seo/seo.types"

// Payloads are FormData when an OG image file is attached, JSON otherwise.
export const seoApiService = {
  // Common SEO + every page's SEO in one call — use this to load the form.
  async getAll(): Promise<AllSeo> {
    const { data } = await apiClient.get<AllSeo>(ENDPOINTS.admin.seo.all)
    return data
  },

  async getCommon(): Promise<CommonSeo> {
    const { data } = await apiClient.get<CommonSeo>(ENDPOINTS.admin.seo.common)
    return data
  },

  async getPage(page: string): Promise<PageSeo> {
    const { data } = await apiClient.get<PageSeo>(ENDPOINTS.admin.seo.page(page))
    return data
  },

  async updateCommon(payload: CommonSeo | FormData): Promise<CommonSeo> {
    const { data } = await apiClient.put<CommonSeo>(ENDPOINTS.admin.seo.common, payload)
    return data
  },

  async updatePage(page: string, payload: PageSeo | FormData): Promise<PageSeo> {
    const { data } = await apiClient.put<PageSeo>(ENDPOINTS.admin.seo.page(page), payload)
    return data
  },
}
