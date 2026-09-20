import { WhyChooseUsTable } from "./_components/WhyChooseUsTable"
import { getWhyChooseUsItems } from "@/server/services/why-choose-us.service"
import type { WhyChooseUsItem } from "./_types/why-choose-us.types"

export const metadata = { title: "Why Choose Us" }
export const dynamic = "force-dynamic"

export default async function WhyChooseUsPage() {
  let initialItems: WhyChooseUsItem[] = []
  try {
    initialItems = await getWhyChooseUsItems()
  } catch (error) {
    console.error("Failed to load initial Why Choose Us items:", error)
  }

  return <WhyChooseUsTable initialItems={initialItems} />
}
