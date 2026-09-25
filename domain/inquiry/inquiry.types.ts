export interface Inquiry {
  id: string;
  fullName: string;
  phone: string | null;
  email: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryPagination {
  pageNumber: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface InquiryPaginatedResponse {
  inquiries: Inquiry[];
  pagination: InquiryPagination;
}

export interface InquiryQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  treatment?: string;
  from?: string;
  to?: string;
}
