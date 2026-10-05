import type { ClinicSettings } from "@/domain/settings/settings.types";
import { buttons, details, esc, eyebrow, formatDate, formatTime, heading, layout, paragraph } from "./layout";

type Inquiry = {
  fullName: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
  type: string;
};

// Clinic name, phone, WhatsApp and address come from Admin → Settings;
// anything left empty there is simply left out of the email.
export function buildConfirmationEmail(inquiry: Inquiry, settings: ClinicSettings): string {
  const clinicName = esc(settings.clinicName);
  const firstName = esc(inquiry.fullName.split(/\s+/)[0] || inquiry.fullName);
  const phone = settings.phone1?.trim() ?? "";
  const whatsapp = settings.whatsappNumber?.replace(/\D/g, "") ?? "";

  const isQuestion = inquiry.type === "inquiry";
  const atClinic = clinicName ? ` at <strong style="color:#18181b;">${clinicName}</strong>` : "";
  const treatment = inquiry.treatment ? ` about <strong style="color:#18181b;">${esc(inquiry.treatment)}</strong>` : "";

  const content = [
    eyebrow(isQuestion ? "Question received" : "Request received"),
    heading(`Thanks, ${firstName}. We&rsquo;ll be in touch soon.`),
    paragraph(
      isQuestion
        ? `We&rsquo;ve received your question${treatment}${atClinic}. ` +
            `Our team will get back to you within <strong style="color:#18181b;">24 hours</strong>.`
        : `We&rsquo;ve received your appointment request${atClinic}. ` +
            `Our team will call you within <strong style="color:#18181b;">24 hours</strong> to confirm a time that works for you.`
    ),
    details([
      ["Treatment", esc(inquiry.treatment)],
      ["Preferred date", esc(formatDate(inquiry.preferredDate))],
      ["Preferred time", esc(formatTime(inquiry.preferredTime))],
    ]),
    buttons([
      { label: "Call us", href: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "" },
      { label: "Chat on WhatsApp", href: whatsapp ? `https://wa.me/${whatsapp}` : "", variant: "secondary" },
    ]),
  ].join("");

  const footer = [
    clinicName,
    esc(settings.address),
    settings.mapLink ? `<a href="${esc(settings.mapLink)}" style="color:#71717a;">Get directions</a>` : "",
  ]
    .filter(Boolean)
    .join("<br />");

  return layout({
    title: isQuestion ? "We received your question" : "We received your request",
    preheader: isQuestion
      ? "Thanks for reaching out. Our team will get back to you within 24 hours."
      : "Thanks for reaching out. Our team will call you within 24 hours to confirm your appointment.",
    brandName: clinicName,
    content,
    footer: footer + `<br /><br />You&rsquo;re receiving this because you submitted a request on our website.`,
  });
}
