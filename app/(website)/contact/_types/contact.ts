import type { InquiryFormData } from "@/domain/inquiry/inquiry.schema";

// What a visitor submits; status is always set by the server.
// type defaults to "appointment" when left out.
export type ContactInquiry = Omit<InquiryFormData, "status" | "type"> &
  Partial<Pick<InquiryFormData, "type">>;
