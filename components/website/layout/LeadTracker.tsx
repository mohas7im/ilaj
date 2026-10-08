"use client"

import { useEffect } from "react"
import { LEAD_EVENTS } from "@/lib/analytics/events"
import { trackEvent } from "@/lib/analytics/track"

// Reports phone and WhatsApp link clicks to Google Analytics as leads.
// One document-level listener covers every such link on the site, including
// ones rendered by server components, so links don't need their own handlers.
export default function LeadTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]")
      const href = link?.getAttribute("href") ?? ""
      if (href.startsWith("tel:")) {
        trackEvent(LEAD_EVENTS.phone)
      } else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) {
        trackEvent(LEAD_EVENTS.whatsapp)
      }
    }

    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  return null
}
