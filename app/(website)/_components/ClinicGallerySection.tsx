import Section, { Container } from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle, { Highlight } from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import ClinicCameraTour from "./ClinicCameraTour";
import ClinicPhotoList from "./ClinicPhotoList";
import type { ClinicPhoto } from "@/domain/clinic-photo/clinic-photo.types";

/** Photos shown by default (the About page); the Gallery page passes Infinity */
const DEFAULT_LIMIT = 6;

/**
 * Clinic photos (About and Gallery pages): heading, then a scroll-driven
 * camera tour of the rooms with their names and descriptions (desktop).
 * Phones and prefers-reduced-motion get a plain photo list instead.
 */
export default function ClinicGallerySection({
  photos,
  limit = DEFAULT_LIMIT,
  titleAs = "h2",
}: {
  photos: ClinicPhoto[];
  limit?: number;
  /** "h1" when this section is the page's main heading (Gallery page) */
  titleAs?: "h1" | "h2";
}) {
  const items = photos.slice(0, limit);

  return (
    <Section contained={false}>
      <Container className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div className="lg:col-span-7">
          <SectionLabel>OUR CLINIC</SectionLabel>
          <SectionTitle as={titleAs}>
            A Space Designed
            <br />
            <Highlight>Around Your Comfort</Highlight>
          </SectionTitle>
        </div>
        <SectionDescription className="max-w-md lg:col-span-5 lg:justify-self-end">
          Bright, calm and fully equipped, every corner of our clinic is
          built to make your visit feel easy.
        </SectionDescription>
      </Container>

      <div className="mt-10 lg:mt-14">
        <ClinicCameraTour photos={items} className="hidden lg:motion-safe:block" />
        <Container className="lg:motion-safe:hidden">
          <ClinicPhotoList photos={items} />
        </Container>
      </div>
    </Section>
  );
}
