import { getWebsiteClinicPhotos } from "../_lib/gallery";
import AppointmentCTA from "../_components/AppointmentCTA";
import ClinicGallerySection from "../_components/ClinicGallerySection";

// Clinic photos come from admin (Clinic Photos); refresh at most every 5 minutes.
export const revalidate = 300;

// Gallery page: all clinic photos in the sticky text + scrolling photos layout
// (the same section as the About page, without its photo limit), then the
// "Get Started" banner. Before & after cases live on /smile-gallery.
export default async function GalleryPage() {
  const photos = await getWebsiteClinicPhotos();

  return (
    <main className="pt-20">
      <ClinicGallerySection photos={photos} limit={Infinity} titleAs="h1" />
      <AppointmentCTA />
    </main>
  );
}
