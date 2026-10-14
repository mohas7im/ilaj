/** Sends a GA4 event. No-op until GoogleAnalytics has loaded (or when it is not configured). */
export function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", name, params ?? {})
}
