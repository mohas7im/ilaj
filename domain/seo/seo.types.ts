// ─── Common / Global SEO ─────────────────────────────────────────────────────

export type CommonSeo = {
  siteName: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultOgImage: string
  googleVerification: string
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

// ─── Share image formats ────────────────────────────────────────────────────────
// Social apps (Facebook, WhatsApp, X) don't show SVG or GIF share images.

export const OG_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

// ─── Batch shape (common + every page in one call) ────────────────────────────

export type AllSeo = {
  common: CommonSeo
  pages: Record<string, PageSeo>
}

// Public pages with their own admin-editable SEO. `value` is the database key
// (the treatments list keeps its old "services" key so saved data survives).
// Treatment detail pages are edited in each Service's form instead.
export const PAGE_OPTIONS: PageOption[] = [
  { value: "home",          label: "Home",          path: "/" },
  { value: "about",         label: "About",         path: "/about" },
  { value: "services",      label: "Treatments",    path: "/treatments" },
  { value: "doctors",       label: "Doctors",       path: "/doctors" },
  { value: "gallery",       label: "Clinic Gallery", path: "/gallery" },
  { value: "smile-gallery", label: "Smile Gallery", path: "/smile-gallery" },
  { value: "testimonials",  label: "Testimonials",  path: "/testimonials" },
  { value: "contact",       label: "Contact",       path: "/contact" },
  { value: "privacy",            label: "Privacy Policy",     path: "/privacy" },
  { value: "terms",              label: "Terms of Use",       path: "/terms" },
  { value: "medical-disclaimer", label: "Medical Disclaimer", path: "/medical-disclaimer" },
]
