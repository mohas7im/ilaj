import DoctorsSection from "../_components/DoctorsSection";
import { generatePageMetadata } from "@/lib/seo";

// Doctors come from the admin database; refresh at most every 5 minutes.
export const revalidate = 300;

// Title, description and share image come from admin → SEO.
export async function generateMetadata() {
  return generatePageMetadata("doctors");
}

export default function DoctorsPage() {
  return (
    <main className="pt-20">
      <DoctorsSection />
    </main>
  );
}
