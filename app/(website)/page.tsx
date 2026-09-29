import Hero from "./_components/Hero";
import AboutSection from "./_components/AboutSection";
import ServicesSection from "./_components/ServicesSection";
import ContactCtaSection from "./_components/ContactCtaSection";
import WhyChooseUsSection from "./_components/WhyChooseUsSection";
import DoctorsSection from "./_components/DoctorsSection";
import GallerySection from "./_components/GallerySection";
import TestimonialsSection from "./_components/TestimonialsSection";
import FaqSection from "./_components/FaqSection";

// Services, FAQs and testimonials come from the admin database; refresh at most every 5 minutes.
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
      <FaqSection />
      <TestimonialsSection />
    </main>
  );
}
