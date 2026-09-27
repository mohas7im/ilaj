import { getFaqs } from "@/server/services/faq.service";
import type { FaqItem } from "@/components/website/common/Faq";

/**
 * Published FAQs from admin, in display order.
 * serviceId null = General FAQs (home page), otherwise that treatment's FAQs.
 */
export async function getWebsiteFaqs(serviceId: string | null): Promise<FaqItem[]> {
  const faqs = await getFaqs({ publishedOnly: true, serviceId });
  return faqs.map(({ question, answer }) => ({ question, answer }));
}
