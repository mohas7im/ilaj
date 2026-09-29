import Section from "@/components/website/common/Section";
import SectionLabel from "@/components/website/common/SectionLabel";
import SectionTitle from "@/components/website/common/SectionTitle";
import SectionDescription from "@/components/website/common/SectionDescription";
import GalleryCarousel from "./GalleryCarousel";
import { getWebsitePatientCases } from "../_lib/gallery";

// Home page Smile Gallery: admin Patient Cases. Hidden until there is one.
export default async function GallerySection() {
  const cases = await getWebsitePatientCases();
  if (cases.length === 0) return null;

  return (
    <Section>

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-10 lg:gap-14">

          {/* Heading */}
          <div className="lg:col-span-7">

            {/* Label */}
            <SectionLabel>SMILE GALLERY</SectionLabel>

            <SectionTitle className="max-w-2xl">
              A Closer Look at
              <br />
              Your Smile Journey
            </SectionTitle>

          </div>

          {/* Description */}
          <div className="flex items-end lg:col-span-3">

            <SectionDescription className="max-w-md">
              Explore our patients’ transformations and take a look
              inside our clinic, designed to make every visit
              comfortable and confident.
            </SectionDescription>

          </div>

        </div>

        {/* Before/after strip + arrows */}
        <GalleryCarousel cases={cases} />

      </Section>
  );
}
