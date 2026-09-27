import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppointmentCTA from "../../_components/AppointmentCTA";
import { getWebsiteService, getWebsiteServices } from "../../_lib/services";
import { getTreatmentFaqs } from "../../_lib/faqs";
import ServiceDetails from "../_components/ServiceDetails";

// Rebuilt in the background at most every 5 minutes, so admin edits show up
// without making every visit hit the database.
export const revalidate = 300;

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getWebsiteServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getWebsiteService(slug);
  if (!result) return {};

  return {
    title: result.service.title,
    description: result.service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const result = await getWebsiteService(slug);
  if (!result) notFound();

  const faqs = await getTreatmentFaqs(result.service.id);

  return (
    <main className="pt-20">
      <ServiceDetails service={result.service} others={result.others} faqs={faqs} />
      <AppointmentCTA />
    </main>
  );
}
