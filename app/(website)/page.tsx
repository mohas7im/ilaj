import Hero from "./_components/Hero";
import AboutSection from "./_components/AboutSection";
import ServicesSection from "./_components/ServicesSection";
import ContactCtaSection from "./_components/ContactCtaSection";
import WhyChooseUsSection from "./_components/WhyChooseUsSection";
import DoctorsSection from "./_components/DoctorsSection";
import GallerySection from "./_components/GallerySection";
import TestimonialsSection from "./_components/TestimonialsSection";
import Section from "@/components/website/common/Section";
import Faq from "@/components/website/common/Faq";
import { Highlight } from "@/components/website/common/SectionTitle";
import { HOME_FAQS } from "./_data/faqs";

// Services come from the admin database; refresh at most every 5 minutes.
export const revalidate = 300;

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <ContactCtaSection />
      <WhyChooseUsSection />
      <DoctorsSection />
      <GallerySection />
      <Section id="faq">
        <Faq
          name="home-faq"
          title={<>Answers To Your <Highlight>Common Questions</Highlight></>}
          description="Everything you need to know before your visit."
          faqs={HOME_FAQS}
        />
      </Section>
      <TestimonialsSection />
    </main>
  );
}
