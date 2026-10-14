import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { LEAD_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track";
import type { ContactInquiry } from "../_types/contact";

export async function submitContactInquiry(payload: ContactInquiry): Promise<{ id: string }> {
  const { data } = await apiClient.post<{ id: string }>(ENDPOINTS.public.inquiries, payload);
  trackEvent(LEAD_EVENTS.form);
  return data;
}
