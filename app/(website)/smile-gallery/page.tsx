import { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import { getWebsitePatientCases } from "../_lib/gallery";
import AppointmentCTA from "../_components/AppointmentCTA";
import PatientCaseGrid from "./_components/PatientCaseGrid";
import { generatePageMetadata } from "@/lib/seo";

// Patient cases come from admin (Patient Cases); refresh at most every 5 minutes.
export const revalidate = 300;

// Title, description and share image come from admin → SEO.
export async function generateMetadata() {
  return generatePageMetadata("smile-gallery");
}

// Smile Gallery: patients' before & after transformations, in the same white
// rounded panel on a gray page as the Services page, then the "Get Started" banner.
export default async function SmileGalleryPage() {
  const cases = await getWebsitePatientCases();

  return (
    <main className="bg-zinc-100 pt-20">

      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-3xl bg-white py-12 sm:py-16 lg:rounded-4xl lg:py-20">

          <Container className="text-center">
            <SectionLabel>SMILE GALLERY</SectionLabel>

            <SectionTitle as="h1">
              Real Patients,
              <br />
              <Highlight>Real Transformations</Highlight>
            </SectionTitle>

            <SectionDescription className="mx-auto mt-3 max-w-xl">
              Drag the slider on each photo to compare the smile before and
              after treatment.
            </SectionDescription>
          </Container>

          <Container className="mt-12 lg:mt-14">
            <PatientCaseGrid cases={cases} />
          </Container>

        </div>
      </div>

      <AppointmentCTA />

    </main>
  );
}
