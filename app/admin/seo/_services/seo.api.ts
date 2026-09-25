import { apiClient } from "@/lib/apiClient"
import type { CommonSeo, PageSeo } from "../_types/seo.types"

// Payloads are FormData when an OG image file is attached, JSON otherwise.
export const seoApiService = {
  async updateCommon(payload: CommonSeo | FormData): Promise<CommonSeo> {
    const { data } = await apiClient.put<CommonSeo>("/api/admin/seo", payload)
    return data
  },

  async updatePage(page: string, payload: PageSeo | FormData): Promise<PageSeo> {
    const { data } = await apiClient.put<PageSeo>(`/api/admin/seo/${page}`, payload)
    return data
  },
}
