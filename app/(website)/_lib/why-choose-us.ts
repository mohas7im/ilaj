import { getWhyChooseUsItems } from "@/server/services/why-choose-us.service";

// Website view of a "Why Choose Us" item from admin.
export type WebsiteWhyChooseUsItem = {
  id: string;
  title: string;
  description: string;
};

/** Admin items in display order. */
export async function getWebsiteWhyChooseUsItems(): Promise<WebsiteWhyChooseUsItem[]> {
  const items = await getWhyChooseUsItems();

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? "",
  }));
}
