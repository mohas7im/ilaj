import { getResend } from "./email";
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

type SendResult = Awaited<ReturnType<ReturnType<typeof getResend>["emails"]["send"]>>;

// Resend reports API errors in the result instead of throwing, so check both.
// A null result means the email was skipped (no patient address), which isn't a failure.
function didFail(label: string, outcome: PromiseSettledResult<SendResult | null>): boolean {
  if (outcome.status === "rejected") {
    console.error(`[sendInquiryEmails] ${label} threw:`, outcome.reason);
    return true;
  }
  if (outcome.value?.error) {
    console.error(`[sendInquiryEmails] ${label} failed:`, outcome.value.error);
    return true;
  }
  return false;
}

/** Sends the clinic notification and patient confirmation. Returns true only if every email was accepted. */
export async function sendInquiryEmails(inquiry: InquiryEmailPayload): Promise<boolean> {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL;
  const toClinic = process.env.RESEND_TO_EMAIL;
  if (!from || !toClinic) {
    throw new Error("RESEND_FROM_EMAIL or RESEND_TO_EMAIL is not set");
  }

  const settings = await getClinicSettings();
  const { clinicName } = settings;

  // Send both emails concurrently — allSettled so one failure never blocks the other
  const [clinicOutcome, patientOutcome] = await Promise.allSettled([

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
      : null,

  ]);

  const clinicFailed = didFail("clinic notification", clinicOutcome);
  const patientFailed = didFail("patient confirmation", patientOutcome);

  return !clinicFailed && !patientFailed;
}
