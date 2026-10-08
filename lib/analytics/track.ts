import { sendGAEvent } from "@next/third-parties/google"

/** Sends a GA4 event. No-op when Google Analytics is not configured. */
export function trackEvent(name: string, params?: Record<string, string>) {
  if (!process.env.NEXT_PUBLIC_GA_ID || typeof window === "undefined") return
  sendGAEvent("event", name, params ?? {})
}
