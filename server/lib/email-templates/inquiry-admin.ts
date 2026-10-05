import { buttons, details, esc, eyebrow, formatDate, formatTime, heading, layout, paragraph, quote } from "./layout";

type Inquiry = {
  fullName: string;
  email: string;
  phone: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string;
  type: string;
};

export function buildAdminEmail(inquiry: Inquiry, clinicName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/admin/inquiries`;

  // WhatsApp reply goes to the patient's own number.
  const patientDigits = inquiry.phone.replace(/\D/g, "");
  const whatsappText = encodeURIComponent(
    inquiry.treatment
      ? `Hi ${inquiry.fullName}, we received your inquiry for ${inquiry.treatment}. We will contact you shortly.`
      : `Hi ${inquiry.fullName}, we received your inquiry. We will contact you shortly.`
  );
  const whatsappUrl = patientDigits ? `https://wa.me/${patientDigits}?text=${whatsappText}` : "";

  const linkStyle = "color:#18181b;text-decoration:none;";
  const phoneLink = inquiry.phone
    ? `<a href="tel:${esc(inquiry.phone.replace(/[^\d+]/g, ""))}" style="${linkStyle}">${esc(inquiry.phone)}</a>`
    : "";
  const emailLink = inquiry.email
    ? `<a href="mailto:${esc(inquiry.email)}" style="${linkStyle}">${esc(inquiry.email)}</a>`
    : "";

  const isQuestion = inquiry.type === "inquiry";
  const treatment = inquiry.treatment
    ? `<strong style="color:#18181b;">${esc(inquiry.treatment)}</strong>`
    : "";

  const content = [
    eyebrow(isQuestion ? "New question" : "New appointment request"),
    heading(esc(inquiry.fullName)),
    paragraph(
      isQuestion
        ? treatment
          ? `Has a question about ${treatment}. Reply to answer it.`
          : "Has a question. Reply to answer it."
        : treatment
          ? `Wants to book ${treatment}. Reach out to confirm a slot.`
          : "Submitted the contact form. Reach out to confirm a slot."
    ),
    details([
      ["Phone", phoneLink],
      ["Email", emailLink],
      ["Treatment", esc(inquiry.treatment)],
      ["Preferred date", esc(formatDate(inquiry.preferredDate))],
      ["Preferred time", esc(formatTime(inquiry.preferredTime))],
    ]),
    quote(isQuestion ? "Question" : "Message", esc(inquiry.message)),
    buttons([
      { label: "Open in dashboard", href: dashboardUrl },
      { label: "Reply on WhatsApp", href: whatsappUrl, variant: "secondary" },
    ]),
  ].join("");

  return layout({
    title: `New inquiry from ${esc(inquiry.fullName)}`,
    preheader: `${esc(inquiry.fullName)}${inquiry.treatment ? ` · ${esc(inquiry.treatment)}` : ""}${inquiry.phone ? ` · ${esc(inquiry.phone)}` : ""}`,
    brandName: esc(clinicName),
    content,
    footer: "Sent automatically from the contact form on your website.",
  });
}
