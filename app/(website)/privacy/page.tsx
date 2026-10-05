import LegalPage from "../_components/legal/LegalPage";
import { generatePageMetadata } from "@/lib/seo";

// SEO title and description come from admin; refresh at most every 5 minutes.
export const revalidate = 300;

// Title, description and share image come from admin → SEO.
export async function generateMetadata() {
  return generatePageMetadata("privacy");
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we collect and use your personal data."
      lastUpdated="5 October 2026"
      currentHref="/privacy"
    >
      <h2>1. What we collect</h2>
      <p>
        When you fill in a form or contact us, we collect your name, phone number, email address, the treatment you
        are interested in, your preferred appointment time and your message.
      </p>

      <h2>2. How we use it</h2>
      <p>
        Only to reply to you, arrange your appointment and provide your dental care. We do not sell your data or
        send you marketing messages.
      </p>

      <h2>3. Who we share it with</h2>
      <p>
        Only with our clinic team and the service providers that run this website, such as hosting and email. If
        you contact us from outside India, your data is transferred to India so we can respond.
      </p>

      <h2>4. How long we keep it</h2>
      <p>Only as long as needed to respond to you and provide care, or as required by law.</p>

      <h2>5. Your rights</h2>
      <p>
        You can ask us to see, correct or delete your data at any time by contacting us. We follow India&rsquo;s
        Digital Personal Data Protection Act, 2023.
      </p>
    </LegalPage>
  );
}
