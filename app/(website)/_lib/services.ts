import { getServices } from "@/server/services/service.service";
import type { Service } from "@/domain/service/service.types";

// Website view of a service from the admin Service table.
export type WebsiteService = {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  /** Long text for "About this treatment"; empty until filled in admin */
  details: string;
  /** Empty until uploaded in admin */
  image: string;
  imageAlt: string;
  /** Empty until uploaded in admin */
  secondaryImage: string;
  secondaryImageAlt: string;
};

function toWebsiteService(service: Service, index: number): WebsiteService {
  return {
    id: service.id,
    slug: service.slug ?? "",
    number: `${String(index + 1).padStart(2, "0")}//`,
    title: service.name,
    description: service.description ?? "",
    details: service.details ?? "",
    image: service.image ?? "",
    imageAlt: service.imageAlt || service.name,
    secondaryImage: service.secondaryImage ?? "",
    secondaryImageAlt: service.secondaryImageAlt || service.name,
  };
}

/** Active services in admin display order; numbers follow that order. */
export async function getWebsiteServices(): Promise<(WebsiteService & { showInHomePage: boolean })[]> {
  const services = await getServices();

  return services
    .filter((service) => service.status === "active" && service.slug)
    .map((service, index) => ({
      ...toWebsiteService(service, index),
      showInHomePage: service.showInHomePage ?? false,
    }));
}

/** One active service plus the rest, for the detail page's "other services". */
export async function getWebsiteService(slug: string) {
  const services = await getWebsiteServices();
  const service = services.find((item) => item.slug === slug);
  if (!service) return null;

  return { service, others: services.filter((item) => item.slug !== slug) };
}
