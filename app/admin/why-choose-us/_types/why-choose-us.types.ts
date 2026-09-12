export type WhyChooseUsItem = {
  id: string
  title: string
  displayOrder: number
}

export type WhyChooseUsSection = {
  badge: string
  title: string
  highlightText: string
  description: string
  image: string
  items: WhyChooseUsItem[]
}
