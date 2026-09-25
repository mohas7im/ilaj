// Every API path in one place. Callers use these instead of typing URLs.
//
//   admin  → /api/admin/*   login required (proxy.ts + requireAdmin)
//   public → /api/public/*  open to website visitors
//   auth   → /api/auth/*    session management

const crud = (base: string) => ({
  list: base,
  byId: (id: string) => `${base}/${id}`,
})

export const ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
    me: "/api/auth/me",
    changePassword: "/api/auth/change-password",
  },

  admin: {
    dashboard: { stats: "/api/admin/dashboard/stats" },
    doctors: crud("/api/admin/doctors"),
    services: crud("/api/admin/services"),
    testimonials: crud("/api/admin/testimonials"),
    whyChooseUs: crud("/api/admin/why-choose-us"),
    inquiries: crud("/api/admin/inquiries"),
    gallery: {
      clinic: crud("/api/admin/gallery/clinic"),
      patient: crud("/api/admin/gallery/patient"),
    },
    seo: {
      common: "/api/admin/seo",
      page: (slug: string) => `/api/admin/seo/${slug}`,
    },
    settings: "/api/admin/settings",
    upload: "/api/admin/upload",
  },

  public: {
    inquiries: "/api/public/inquiries",
  },
} as const
