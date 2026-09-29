// Shared building blocks for the inquiry emails, styled after the website
// (styles/website/theme.css): crimson brand, zinc neutrals, Geist headings,
// Manrope body, pill buttons. Emails need inline styles and table layout —
// most mail clients ignore <style> blocks and flexbox.

export const BRAND = "#DA2420";

const FONT_BODY = "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const FONT_HEADING = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Escapes visitor-typed text before it goes into the HTML. */
export function esc(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "2026-10-03" → "Sat, 3 Oct 2026". Anything unparseable is returned as-is. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(+match[1], +match[2] - 1, +match[3]));
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "14:30" → "2:30 PM". Anything unparseable is returned as-is. */
export function formatTime(value: string | null | undefined): string {
  if (!value) return "";
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const hours = +match[1];
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${match[2]} ${suffix}`;
}

/** Small uppercase label above a heading, like the website's section pills. */
export function eyebrow(text: string): string {
  return `<span style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(218,36,32,0.08);color:${BRAND};font-family:${FONT_HEADING};font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;">${text}</span>`;
}

export function heading(text: string): string {
  return `<h1 style="margin:20px 0 0;font-family:${FONT_HEADING};font-size:28px;line-height:1.2;font-weight:600;letter-spacing:-0.02em;color:#18181b;">${text}</h1>`;
}

export function paragraph(html: string): string {
  return `<p style="margin:14px 0 0;font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:#52525b;">${html}</p>`;
}

/**
 * Label/value list. Rows with an empty value are left out, so optional
 * fields the visitor skipped don't show up as blank lines.
 */
export function details(rows: Array<[label: string, value: string]>): string {
  const filled = rows.filter(([, value]) => value.trim() !== "");
  if (filled.length === 0) return "";

  const body = filled
    .map(
      ([label, value], i) => `
        <tr>
          <td style="padding:14px 0;${i > 0 ? "border-top:1px solid #f4f4f5;" : ""}font-family:${FONT_BODY};font-size:13px;color:#71717a;width:38%;vertical-align:top;">${label}</td>
          <td style="padding:14px 0;${i > 0 ? "border-top:1px solid #f4f4f5;" : ""}font-family:${FONT_BODY};font-size:14px;font-weight:600;color:#18181b;vertical-align:top;">${value}</td>
        </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-radius:16px;background:#fafafa;">
      <tr><td style="padding:6px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>
      </td></tr>
    </table>`;
}

/** A quoted block for free-text the visitor wrote. */
export function quote(label: string, text: string): string {
  if (!text.trim()) return "";
  return `
    <p style="margin:28px 0 8px;font-family:${FONT_BODY};font-size:13px;color:#71717a;">${label}</p>
    <div style="padding:16px 18px;border-left:3px solid ${BRAND};border-radius:0 12px 12px 0;background:#fafafa;font-family:${FONT_BODY};font-size:14px;line-height:1.65;color:#27272a;white-space:pre-line;">${text}</div>`;
}

/** Pill buttons, matching the website's rounded-full Button. */
export function buttons(items: Array<{ label: string; href: string; variant?: "primary" | "secondary" }>): string {
  const cells = items
    .filter((item) => item.href)
    .map(({ label, href, variant = "primary" }) => {
      const primary = variant === "primary";
      const style = primary
        ? `background:${BRAND};color:#ffffff;border:1px solid ${BRAND};`
        : "background:#ffffff;color:#18181b;border:1px solid #e4e4e7;";
      return `
        <td style="padding:0 10px 10px 0;">
          <a href="${href}" style="display:inline-block;padding:13px 26px;border-radius:999px;${style}font-family:${FONT_BODY};font-size:14px;font-weight:600;text-decoration:none;">${label}</a>
        </td>`;
    })
    .join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr>${cells}</tr></table>`;
}

/** Page shell: grey canvas, white rounded card, brand name on top, footer below. */
export function layout({
  title,
  preheader,
  brandName,
  content,
  footer,
}: {
  title: string;
  /** Preview text shown next to the subject in the inbox list */
  preheader: string;
  brandName: string;
  content: string;
  footer: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@500;600&family=Manrope:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

            ${brandName ? `
            <tr>
              <td style="padding:0 8px 20px;font-family:${FONT_HEADING};font-size:16px;font-weight:600;letter-spacing:-0.01em;color:#18181b;">
                <span style="display:inline-block;width:10px;height:10px;margin-right:8px;border-radius:999px;background:${BRAND};"></span>${brandName}
              </td>
            </tr>` : ""}

            <tr>
              <td style="padding:40px 36px;border-radius:24px;background:#ffffff;box-shadow:0 1px 2px rgba(24,24,27,0.04);">
                ${content}
              </td>
            </tr>

            <tr>
              <td style="padding:24px 8px 0;font-family:${FONT_BODY};font-size:12px;line-height:1.6;color:#a1a1aa;">
                ${footer}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
