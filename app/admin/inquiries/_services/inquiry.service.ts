import { apiClient } from "@/lib/apiClient";
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
  const query = new URLSearchParams();

  const pageNumber = params?.pageNumber || 1;
  const pageSize = params?.pageSize || 10;

  query.set("pageNumber", String(pageNumber));
  query.set("pageSize", String(pageSize));

  if (params?.search) query.set("search", params.search.trim());
  if (params?.treatment && params.treatment !== "all") {
    query.set("treatment", params.treatment.trim());
  }
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);

  const queryString = query.toString();
  const url = `/api/admin/inquiries${queryString ? `?${queryString}` : ""}`;

  const { data } = await apiClient.get<InquiryPaginatedResponse>(url);
  return data;
}

/**
 * Fetch services list directly from /api/admin/services to populate treatment options.
 * Self-contained in inquiry service folder without importing from admin services module.
 */
export async function fetchTreatmentServices(): Promise<string[]> {
  try {
    const { data } = await apiClient.get<Array<{ id: string; name: string; status?: string }>>(
      "/api/admin/services"
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
  await apiClient.delete(`/api/admin/inquiries/${id}`);
  return true;
}

/**
 * Update inquiry status
 */
export async function updateInquiryStatus(
  id: string,
  status: string
): Promise<Inquiry> {
  const { data } = await apiClient.put<Inquiry>(`/api/admin/inquiries/${id}`, {
    status,
  });
  return data;
}

/**
 * Fetch single inquiry by ID
 */
export async function getInquiryById(id: string): Promise<Inquiry | null> {
  try {
    const { data } = await apiClient.get<Inquiry>(`/api/admin/inquiries/${id}`);
    return data;
  } catch (error) {
    console.error("Failed to get inquiry by id:", error);
    return null;
  }
}
