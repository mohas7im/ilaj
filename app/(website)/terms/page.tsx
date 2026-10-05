import Link from "next/link";
import LegalPage from "../_components/legal/LegalPage";
import { generatePageMetadata } from "@/lib/seo";

// SEO title and description come from admin; refresh at most every 5 minutes.
export const revalidate = 300;

// Title, description and share image come from admin → SEO.
export async function generateMetadata() {
  return generatePageMetadata("terms");
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="The terms for using this website."
      lastUpdated="5 October 2026"
      currentHref="/terms"
    >
      <h2>1. Using this website</h2>
      <p>
        By using this website you agree to these terms and our <Link href="/privacy">Privacy Policy</Link>. The
        information here is general and is not medical advice. See our{" "}
        <Link href="/medical-disclaimer">Medical Disclaimer</Link>.
      </p>

      <h2>2. Appointments</h2>
      <p>
        Submitting a form is a request, not a confirmed appointment. Your appointment is confirmed only when our
        team contacts you.
      </p>

      <h2>3. Prices</h2>
      <p>Any prices or estimates are indicative. Your final cost is confirmed after an examination.</p>

      <h2>4. Patients from abroad</h2>
      <p>
        Treatment plans shared before your visit are estimates and are confirmed after an in-person examination.
        You are responsible for your own travel, visa and accommodation.
      </p>

      <h2>5. Content</h2>
      <p>The text, images and logo on this website belong to us and may not be copied without permission.</p>

      <h2>6. Governing law</h2>
      <p>These terms are governed by the laws of India.</p>
    </LegalPage>
  );
}
