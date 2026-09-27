import sanitizeHtml from "sanitize-html"
import { toRichTextHtml } from "@/lib/rich-text"

// Only what the admin rich-text editor can produce. Anything else (scripts,
// inline styles, event handlers, iframes...) is stripped before saving, so
// the public website never renders untrusted markup.
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "h2", "h3", "strong", "em", "u", "s",
    "a", "ul", "ol", "li", "blockquote", "hr",
  ],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    // Normalise tags some browsers paste in
    b: "strong",
    i: "em",
    h1: "h2",
    h4: "h3",
    a: (tagName, attribs) => ({
      tagName,
      attribs: attribs.target === "_blank"
        ? { ...attribs, rel: "noopener noreferrer nofollow" }
        : attribs,
    }),
  },
}

/** Clean rich-text HTML (or legacy plain text) for storage; empty → null. */
export function sanitizeRichText(input: string | null | undefined): string | null {
  if (!input?.trim()) return null
  const clean = sanitizeHtml(toRichTextHtml(input), OPTIONS).trim()
  // An editor cleared by the user can leave just "<p></p>"
  return clean.replace(/<p>\s*<\/p>/g, "") ? clean : null
}
