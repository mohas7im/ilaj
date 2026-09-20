import { apiClient } from "@/lib/apiClient";
import type {
  Inquiry,
  InquiryPaginatedResponse,
  InquiryQueryParams,
} from "../_types/inquiry.types";

export const TREATMENT_OPTIONS = [
  "General Dental Checkup",
  "Teeth Cleaning & Whitening",
  "Dental Implants",
  "Orthodontic Braces",
  "Root Canal Treatment",
  "Cosmetic Veneers",
  "Pediatric Dental Care",
  "Wisdom Tooth Extraction",
  "Crowns & Bridges",
] as const;

export const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
] as const;

/**
 * Fetch inquiries with server-side pagination, search, treatment, and date range filters
 */
export async function fetchInquiries(
  params?: InquiryQueryParams
): Promise<InquiryPaginatedResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search.trim());
  if (params?.treatment && params.treatment !== "all") {
    query.set("treatment", params.treatment.trim());
  }
  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);

  const queryString = query.toString();
  const url = `/api/inquiries${queryString ? `?${queryString}` : ""}`;

  const { data } = await apiClient.get<InquiryPaginatedResponse>(url);
  return data;
}

/**
 * Fetch services list directly from /api/services to populate treatment options.
 * Defined locally within inquiries service folder without importing from admin services module.
 */
export async function fetchTreatmentServices(): Promise<string[]> {
  try {
    const { data } = await apiClient.get<Array<{ id: string; name: string; status?: string }>>(
      "/api/services"
    );

    if (Array.isArray(data)) {
      const names = data
        .filter((service) => service.status !== "inactive")
        .map((service) => service.name?.trim())
        .filter((name): name is string => Boolean(name));

      // Return unique names
      const uniqueNames = Array.from(new Set(names));
      if (uniqueNames.length > 0) {
        return uniqueNames;
      }
    }
    return [...TREATMENT_OPTIONS];
  } catch (error) {
    console.error("Failed to fetch treatment services:", error);
    return [...TREATMENT_OPTIONS];
  }
}

/**
 * Delete an inquiry by ID
 */
export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/inquiries/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    throw error;
  }
}

/**
 * Update inquiry status (e.g. 'new', 'contacted', 'resolved')
 */
export async function updateInquiryStatus(
  id: string,
  status: string
): Promise<Inquiry> {
  const { data } = await apiClient.put<Inquiry>(`/api/inquiries/${id}`, {
    status,
  });
  return data;
}

/**
 * Fetch single inquiry by ID
 */
export async function getInquiryById(id: string): Promise<Inquiry | null> {
  try {
    const { data } = await apiClient.get<Inquiry>(`/api/inquiries/${id}`);
    return data;
  } catch (error) {
    console.error("Failed to get inquiry by id:", error);
    return null;
  }
}
