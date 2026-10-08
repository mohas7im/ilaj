"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

// Loads Google Analytics 4 (gtag.js) after hydration. Written in-house rather
// than using @next/third-parties, whose CommonJS export resolves to undefined
// under vinext and crashes the layout.
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    if (window.gtag) return

    window.dataLayer = window.dataLayer || []
    // gtag.js expects the arguments object itself, not an array.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag("js", new Date())
    window.gtag("config", gaId)

    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`
    document.head.appendChild(script)
  }, [gaId])

  return null
}
