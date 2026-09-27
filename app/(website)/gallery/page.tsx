import { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import { getWebsiteClinicPhotos, getWebsitePatientCases } from "../_lib/gallery";
import AppointmentCTA from "../_components/AppointmentCTA";
import GalleryTabs from "./_components/GalleryTabs";

// Gallery items come from admin (Clinic Photos / Patient Cases); refresh at
// most every 5 minutes.
export const revalidate = 300;

// Gallery page: same white rounded panel on a gray page as the Services page,
// centered header, tabs for clinic photos and before/after cases, then the
// "Get Started" banner.
export default async function GalleryPage() {
  const [photos, cases] = await Promise.all([getWebsiteClinicPhotos(), getWebsitePatientCases()]);

  return (
    <main className="bg-zinc-100 pt-20">

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-3xl bg-white py-12 sm:py-16 lg:rounded-4xl lg:py-20">

          <Container className="text-center">
            <SectionLabel>ILAJ GALLERY</SectionLabel>

            <SectionTitle as="h1">
              A Closer Look At
              <br />
              Our <Highlight>Clinic &amp; Smiles</Highlight>
            </SectionTitle>
          </Container>

          <Container className="mt-8">
            <GalleryTabs
              photos={photos}
              cases={cases}
            />
          </Container>

        </div>
      </div>

      <AppointmentCTA />

    </main>
  );
}
