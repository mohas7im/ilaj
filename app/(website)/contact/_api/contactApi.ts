import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ContactInquiry } from "../_types/contact";

export async function submitContactInquiry(payload: ContactInquiry): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(ENDPOINTS.public.inquiries, payload);
  return data;
}
