import type { Inquiry } from "../_types/inquiry.types"

export const TREATMENT_OPTIONS = [
  "General Dental Checkup",
  "Teeth Cleaning & Whitening",
  "Dental Implants",
  "Orthodontic Braces",
  "Root Canal Treatment",
  "Cosmetic Veneers",
  "Pediatric Dental Care",
  "Wisdom Tooth Extraction",
  "Crowns & Bridges",
] as const

export const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
] as const

export let MOCK_INQUIRIES: Inquiry[] = [
  {
    id: "i1",
    fullName: "Zara Khan",
    name: "Zara Khan",
    email: "zara.khan@email.com",
    phone: "+92-300-1111111",
    treatment: "Dental Implants",
    preferredDate: "2024-09-15",
    preferredTime: "10:00 AM - 11:00 AM",
    subject: "Dental Implants",
    message: "Hello, I would like to know the cost of dental implants and whether you offer installment plans. I need to replace two missing lower molars.",
    createdAt: "2024-09-03T08:00:00Z",
  },
  {
    id: "i2",
    fullName: "Ahmed Siddiqui",
    name: "Ahmed Siddiqui",
    email: "ahmed.s@email.com",
    phone: "+92-321-2222222",
    treatment: "General Dental Checkup",
    preferredDate: "2024-09-18",
    preferredTime: "02:00 PM - 03:00 PM",
    subject: "General Dental Checkup",
    message: "I am looking for a general dental checkup this week. Please let me know if this slot is available.",
    createdAt: "2024-09-02T14:30:00Z",
  },
  {
    id: "i3",
    fullName: "Fatima Iqbal",
    name: "Fatima Iqbal",
    email: "fatima.iqbal@email.com",
    phone: "+92-333-4567890",
    treatment: "Orthodontic Braces",
    preferredDate: "2024-09-20",
    preferredTime: "04:00 PM - 05:00 PM",
    subject: "Orthodontic Braces",
    message: "My 12-year-old daughter needs braces consultation. Could you please tell me about ceramic vs metallic options?",
    createdAt: "2024-09-02T10:15:00Z",
  },
  {
    id: "i4",
    fullName: "Usman Ali",
    name: "Usman Ali",
    email: "usman.ali@email.com",
    phone: "+92-333-3333333",
    treatment: "Teeth Cleaning & Whitening",
    preferredDate: "2024-09-14",
    preferredTime: "11:00 AM - 12:00 PM",
    subject: "Teeth Cleaning & Whitening",
    message: "I am interested in laser teeth whitening. How many sessions are typically required for stained teeth?",
    createdAt: "2024-09-01T16:00:00Z",
  },
  {
    id: "i5",
    fullName: "Nadia Rehman",
    name: "Nadia Rehman",
    email: "nadia.r@email.com",
    phone: "+92-345-4444444",
    treatment: "Root Canal Treatment",
    preferredDate: "2024-09-10",
    preferredTime: "03:00 PM - 04:00 PM",
    subject: "Root Canal Treatment",
    message: "Severe tooth pain on the upper right side. Need examination as soon as possible.",
    createdAt: "2024-08-28T09:00:00Z",
  },
]

export async function getInquiries(): Promise<Inquiry[]> {
  return [...MOCK_INQUIRIES]
}

export async function getInquiryById(id: string): Promise<Inquiry | undefined> {
  return MOCK_INQUIRIES.find((i) => i.id === id)
}

export async function createInquiry(data: Omit<Inquiry, "id" | "createdAt">): Promise<Inquiry> {
  const newInquiry: Inquiry = {
    ...data,
    fullName: data.fullName ?? data.name ?? "Anonymous",
    name: data.fullName ?? data.name ?? "Anonymous",
    subject: data.treatment ?? data.subject ?? "Appointment Inquiry",
    treatment: data.treatment ?? data.subject ?? "General Dental Checkup",
    phone: data.phone ?? "",
    email: data.email ?? "",
    preferredDate: data.preferredDate ?? new Date().toISOString().split("T")[0],
    preferredTime: data.preferredTime ?? "10:00 AM - 11:00 AM",
    message: data.message ?? "",
    id: `i_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  MOCK_INQUIRIES = [newInquiry, ...MOCK_INQUIRIES]
  return newInquiry
}

export async function updateInquiryStatus(id: string, status: string): Promise<Inquiry | null> {
  const index = MOCK_INQUIRIES.findIndex((i) => i.id === id)
  if (index === -1) return null
  MOCK_INQUIRIES[index] = { ...MOCK_INQUIRIES[index], status }
  return MOCK_INQUIRIES[index]
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const initialLen = MOCK_INQUIRIES.length
  MOCK_INQUIRIES = MOCK_INQUIRIES.filter((i) => i.id !== id)
  return MOCK_INQUIRIES.length < initialLen
}
