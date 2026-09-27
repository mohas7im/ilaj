import Section from "@/components/website/common/Section";
import Faq from "@/components/website/common/Faq";
import { Highlight } from "@/components/website/common/SectionTitle";
import { getWebsiteFaqs } from "../_lib/faqs";

// Home page FAQ: the "General" FAQs from admin. Hidden until there is one.
export default async function FaqSection() {
  const faqs = await getWebsiteFaqs(null);
  if (faqs.length === 0) return null;

  return (
    <Section id="faq">
      <Faq
        name="home-faq"
        title={<>Answers To Your <Highlight>Common Questions</Highlight></>}
        description="Everything you need to know before your visit."
        faqs={faqs}
      />
    </Section>
  );
}
