export interface DashboardInquiry {
  id: string
  fullName: string
  email: string
  phone?: string | null
  treatment: string
  preferredDate?: string | null
  preferredTime?: string | null
  message?: string
  status?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface DashboardStats {
  totalInquiries: number
  totalDoctors: number
  totalServices: number
  totalTestimonials: number
}

export interface DashboardInquiriesResponse {
  inquiries: DashboardInquiry[]
  pagination: {
    pageNumber: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export type ActivityType = "patient" | "inquiry" | "doctor" | "service"

export type ActivityItem = {
  id: string
  type: ActivityType
  title: string
  description: string
  time: string
  status: "new" | "contacted" | "resolved" | "info"
}
