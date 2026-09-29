import AboutIntroSection from "./_components/AboutIntroSection";
import OurStorySection from "./_components/OurStorySection";
import ClinicGallerySection from "../_components/ClinicGallerySection";
import DoctorsSection from "../_components/DoctorsSection";
import AppointmentCTA from "../_components/AppointmentCTA";
import { getWebsiteClinicPhotos } from "../_lib/gallery";
import { generatePageMetadata } from "@/lib/seo";

// Clinic photos come from admin; refresh at most every 5 minutes.
export const revalidate = 300;

// Title, description and share image come from admin → SEO.
export async function generateMetadata() {
  return generatePageMetadata("about");
}

export default async function AboutPage() {
  const photos = await getWebsiteClinicPhotos();

  return (
    <main className="pt-20">
      <AboutIntroSection />
      <OurStorySection />
      {photos.length > 0 && <ClinicGallerySection photos={photos} />}
      <DoctorsSection />
      <AppointmentCTA />
    </main>
  );
}
