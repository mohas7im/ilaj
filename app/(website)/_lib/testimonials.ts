import { getTestimonials } from "@/server/services/testimonial.service";

// Website view of a testimonial from the admin Testimonial table.
export type WebsiteTestimonial = {
  id: string;
  name: string;
  treatment: string;
  rating: number;
  review: string;
};

/** Published testimonials for the home/testimonials pages, in display order. */
export async function getWebsiteTestimonials(): Promise<WebsiteTestimonial[]> {
  const testimonials = await getTestimonials({ publishedOnly: true });

  return testimonials.map((t) => ({
    id: t.id,
    name: t.patientName,
    treatment: t.treatment,
    rating: t.rating,
    review: t.review,
  }));
}
