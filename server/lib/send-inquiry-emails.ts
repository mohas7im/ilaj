import { resend } from "./email";
import { buildAdminEmail } from "./email-templates/inquiry-admin";
import { buildConfirmationEmail } from "./email-templates/inquiry-confirmation";

type InquiryEmailPayload = {
  fullName: string;
  email: string;
  phone: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string;
};

export async function sendInquiryEmails(inquiry: InquiryEmailPayload) {
  const from = process.env.RESEND_FROM_EMAIL!;
  const toClinic = process.env.RESEND_TO_EMAIL!;

  // Send both emails concurrently — allSettled so one failure never blocks the other
  await Promise.allSettled([

    // 1 → Notify clinic
    resend.emails.send({
      from,
      to: toClinic,
      subject: `📋 New Inquiry — ${inquiry.fullName}`,
      html: buildAdminEmail(inquiry),
    }),

    // 2 → Confirm to patient
    resend.emails.send({
      from,
      to: inquiry.email,
      subject: "We received your request — Ilaj Dental Care",
      html: buildConfirmationEmail(inquiry),
    }),

  ]);
}
