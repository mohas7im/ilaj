import TestimonialsSection from "../_components/TestimonialsSection";

// Testimonials come from the admin database; refresh at most every 5 minutes.
export const revalidate = 300;

export default function TestimonialsPage() {
  return (
    <main className="pt-20">
      <TestimonialsSection />
    </main>
  );
}
