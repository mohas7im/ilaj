import { getFaqs } from "@/server/services/faq.service";
import { getServiceFaqs } from "@/server/services/service.service";
import type { FaqItem } from "@/components/website/common/Faq";

const toItem = ({ question, answer }: FaqItem): FaqItem => ({ question, answer });

/** Published General FAQs for the home page, in display order. */
export async function getHomeFaqs(): Promise<FaqItem[]> {
  return (await getFaqs({ publishedOnly: true })).map(toItem);
}

/** A treatment's FAQs (Service form in admin), in display order. */
export async function getTreatmentFaqs(serviceId: string): Promise<FaqItem[]> {
  return (await getServiceFaqs(serviceId)).map(toItem);
}
