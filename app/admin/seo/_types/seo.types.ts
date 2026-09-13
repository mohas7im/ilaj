// ─── Common / Global SEO ─────────────────────────────────────────────────────

export type CommonSeo = {
  siteName: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultOgImage: string
  googleVerification: string
  bingVerification: string
}

// ─── Page-Specific SEO ────────────────────────────────────────────────────────

export type PageSeo = {
  /** Slug used as unique identifier, e.g. "home", "about", "services" */
  page: string
  title: string
  description: string
  ogImage: string
}

// ─── Page options available in the selector ───────────────────────────────────

export type PageOption = {
  value: string
  label: string
  path: string
}

export const PAGE_OPTIONS: PageOption[] = [
  { value: "home",         label: "Home",           path: "/" },
  { value: "about",        label: "About",           path: "/about" },
  { value: "services",     label: "Services",        path: "/services" },
  { value: "doctors",      label: "Doctors",         path: "/doctors" },
  { value: "gallery",      label: "Gallery",         path: "/gallery" },
  { value: "testimonials", label: "Testimonials",    path: "/testimonials" },
  { value: "why-choose-us",label: "Why Choose Us",   path: "/why-choose-us" },
  { value: "contact",      label: "Contact",         path: "/contact" },
]
