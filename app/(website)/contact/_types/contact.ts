import type { InquiryFormData } from "@/domain/inquiry/inquiry.schema";

// What a visitor submits; status is always set by the server.
export type ContactInquiry = Omit<InquiryFormData, "status">;
