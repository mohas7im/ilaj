import { resend } from "./email";
import { buildAdminEmail } from "./email-templates/inquiry-admin";
import { buildConfirmationEmail } from "./email-templates/inquiry-confirmation";
import { getClinicSettings } from "@/server/services/settings.service";

type InquiryEmailPayload = {
  fullName: string;
  email: string;
  phone: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string;
  type: string;
};

export async function sendInquiryEmails(inquiry: InquiryEmailPayload) {
  const from = process.env.RESEND_FROM_EMAIL!;
  const toClinic = process.env.RESEND_TO_EMAIL!;
  const settings = await getClinicSettings();
  const { clinicName } = settings;

  // Send both emails concurrently — allSettled so one failure never blocks the other
  await Promise.allSettled([

    // 1 → Notify clinic
    resend.emails.send({
      from,
      to: toClinic,
      subject: [
        inquiry.type === "inquiry" ? "New question" : "New appointment request",
        `: ${inquiry.fullName}`,
        inquiry.treatment ? ` · ${inquiry.treatment}` : "",
      ].join(""),
      html: buildAdminEmail(inquiry, clinicName),
    }),

    // 2 → Confirm to patient (email is optional, so only when one was given)
    inquiry.email
      ? resend.emails.send({
          from,
          to: inquiry.email,
          subject: clinicName ? `We received your request — ${clinicName}` : "We received your request",
          html: buildConfirmationEmail(inquiry, settings),
        })
      : Promise.resolve(),

  ]);
}
