export type WhyChooseUsItem = {
  id: string
  title: string
  description?: string | null
  displayOrder: number
  createdAt?: string
  updatedAt?: string
}

export type WhyChooseUsSection = {
  badge: string
  title: string
  highlightText: string
  description: string
  image?: string | null
  items: WhyChooseUsItem[]
}
