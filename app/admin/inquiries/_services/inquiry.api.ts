import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Inquiry,
  InquiryPaginatedResponse,
  InquiryQueryParams,
} from "../_types/inquiry.types";

/**
 * Fetch inquiries with server-side pagination, search, treatment, and date range filters
 */
export async function fetchInquiries(
  params?: InquiryQueryParams
): Promise<InquiryPaginatedResponse> {
  // axios drops undefined params, so unset filters never reach the query string
  const { data } = await apiClient.get<InquiryPaginatedResponse>(ENDPOINTS.admin.inquiries.list, {
    params: {
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 10,
      search: params?.search?.trim() || undefined,
      treatment:
        params?.treatment && params.treatment !== "all" ? params.treatment.trim() : undefined,
      from: params?.from || undefined,
      to: params?.to || undefined,
    },
  });
  return data;
}

/**
 * Fetch services list directly from /api/admin/services to populate treatment options.
 * Self-contained in inquiry service folder without importing from admin services module.
 */
export async function fetchTreatmentServices(): Promise<string[]> {
  try {
    const { data } = await apiClient.get<Array<{ id: string; name: string; status?: string }>>(
      ENDPOINTS.admin.services.list
    );

    if (Array.isArray(data)) {
      const names = data
        .filter((service) => service.status !== "inactive")
        .map((service) => service.name?.trim())
        .filter((name): name is string => Boolean(name));

      return Array.from(new Set(names));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch treatment services from /api/admin/services:", error);
    return [];
  }
}

/**
 * Delete an inquiry by ID
 */
export async function deleteInquiry(id: string): Promise<boolean> {
  await apiClient.delete(ENDPOINTS.admin.inquiries.byId(id));
  return true;
}

/**
 * Update inquiry status
 */
export async function updateInquiryStatus(
  id: string,
  status: string
): Promise<Inquiry> {
  const { data } = await apiClient.put<Inquiry>(ENDPOINTS.admin.inquiries.byId(id), {
    status,
  });
  return data;
}

/**
 * Fetch single inquiry by ID
 */
export async function getInquiryById(id: string): Promise<Inquiry | null> {
  try {
    const { data } = await apiClient.get<Inquiry>(ENDPOINTS.admin.inquiries.byId(id));
    return data;
  } catch (error) {
    console.error("Failed to get inquiry by id:", error);
    return null;
  }
}
