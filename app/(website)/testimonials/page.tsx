import TestimonialsSection from "../_components/TestimonialsSection";
import { generatePageMetadata } from "@/lib/seo";

// Testimonials come from the admin database; refresh at most every 5 minutes.
export const revalidate = 300;

// Title, description and share image come from admin → SEO.
export async function generateMetadata() {
  return generatePageMetadata("testimonials");
}

export default function TestimonialsPage() {
  return (
    <main className="pt-20">
      <TestimonialsSection />
    </main>
  );
}
