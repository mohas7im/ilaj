import LegalPage from "../_components/legal/LegalPage";
import { generatePageMetadata } from "@/lib/seo";

// SEO title and description come from admin; refresh at most every 5 minutes.
export const revalidate = 300;

// Title, description and share image come from admin → SEO.
export async function generateMetadata() {
  return generatePageMetadata("medical-disclaimer");
}

export default function MedicalDisclaimerPage() {
  return (
    <LegalPage
      title="Medical Disclaimer"
      intro="Please read this before relying on information on this website."
      lastUpdated="5 October 2026"
      currentHref="/medical-disclaimer"
    >
      <h2>1. Not medical advice</h2>
      <p>
        The information on this website is for general information only. It does not replace an examination by a
        qualified dentist.
      </p>

      <h2>2. Results vary</h2>
      <p>Before-and-after photos and reviews show individual results. Your results may be different.</p>

      <h2>3. Emergencies</h2>
      <p>
        This website is not for emergencies. If you have severe pain, swelling or bleeding, call the clinic or your
        local emergency services.
      </p>
    </LegalPage>
  );
}
