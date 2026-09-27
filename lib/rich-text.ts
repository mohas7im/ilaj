// Rich-text helpers shared by the admin editor, the server (on save) and the
// website. Older content may be plain text, with a blank line between paragraphs.

export function isHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text)
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Plain text → <p> per paragraph, single line breaks → <br />. HTML is returned as-is. */
export function toRichTextHtml(text: string): string {
  if (isHtml(text)) return text

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("")
}
