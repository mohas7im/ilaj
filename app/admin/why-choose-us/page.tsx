import { WhyChooseUsTable } from "./_components/WhyChooseUsTable"
import { INITIAL_WHY_CHOOSE_US } from "./_services/why-choose-us.service"

export const metadata = { title: "Why Choose Us" }

export default function WhyChooseUsPage() {
  return <WhyChooseUsTable initialItems={INITIAL_WHY_CHOOSE_US.items} />
}
