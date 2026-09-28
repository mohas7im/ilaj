type Inquiry = {
  fullName: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
};

export function buildConfirmationEmail(inquiry: Inquiry): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">

        <h2 style="color: #0f766e;">Thank you, ${inquiry.fullName}! 🦷</h2>

        <p style="font-size: 16px; line-height: 1.6;">
          We have received your inquiry at <strong>Ilaj Dental Care</strong>.
          Our team will contact you within <strong>24 hours</strong> to confirm your appointment.
        </p>

        <h3 style="margin-top: 24px;">Your Request Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f4f4f5;">
            <td style="padding: 10px 14px; font-weight: bold; width: 40%;">Treatment</td>
            <td style="padding: 10px 14px;">${inquiry.treatment}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold;">Preferred Date</td>
            <td style="padding: 10px 14px;">${inquiry.preferredDate ?? "—"}</td>
          </tr>
          <tr style="background: #f4f4f5;">
            <td style="padding: 10px 14px; font-weight: bold;">Preferred Time</td>
            <td style="padding: 10px 14px;">${inquiry.preferredTime ?? "—"}</td>
          </tr>
        </table>

        <p style="margin-top: 28px; color: #555; font-size: 14px;">
          If you have any urgent questions, feel free to call us directly.<br/>
          <strong>Ilaj Dental Care Team</strong>
        </p>

      </body>
    </html>
  `;
}
