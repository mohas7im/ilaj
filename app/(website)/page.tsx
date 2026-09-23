import Hero from "./_components/Hero";
import AboutSection from "./_components/AboutSection";
import ServicesSection from "./_components/ServicesSection";
import ContactCtaSection from "./_components/ContactCtaSection";
import WhyChooseUsSection from "./_components/WhyChooseUsSection";
import DoctorsSection from "./_components/DoctorsSection";
import GallerySection from "./_components/GallerySection";
import TestimonialsSection from "./_components/TestimonialsSection";

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
      <TestimonialsSection />
    </main>
  );
}
