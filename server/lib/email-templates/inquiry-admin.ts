type Inquiry = {
  fullName: string;
  email: string;
  phone: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
  message: string;
};

export function buildAdminEmail(inquiry: Inquiry): string {
  const whatsappNumber = process.env.CLINIC_WHATSAPP ?? "";
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const whatsappText = encodeURIComponent(
    `Hi ${inquiry.fullName}, we received your inquiry for ${inquiry.treatment}. We will contact you shortly.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;
  const dashboardUrl = `${baseUrl}/admin/inquiries`;

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">

        <h2 style="color: #0f766e;">📋 New Inquiry — ${inquiry.fullName}</h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr style="background: #f4f4f5;">
            <td style="padding: 10px 14px; font-weight: bold; width: 40%;">Name</td>
            <td style="padding: 10px 14px;">${inquiry.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold;">Phone</td>
            <td style="padding: 10px 14px;">${inquiry.phone}</td>
          </tr>
          <tr style="background: #f4f4f5;">
            <td style="padding: 10px 14px; font-weight: bold;">Email</td>
            <td style="padding: 10px 14px;">${inquiry.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold;">Treatment</td>
            <td style="padding: 10px 14px;">${inquiry.treatment}</td>
          </tr>
          <tr style="background: #f4f4f5;">
            <td style="padding: 10px 14px; font-weight: bold;">Preferred Date</td>
            <td style="padding: 10px 14px;">${inquiry.preferredDate ?? "—"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold;">Preferred Time</td>
            <td style="padding: 10px 14px;">${inquiry.preferredTime ?? "—"}</td>
          </tr>
          <tr style="background: #f4f4f5;">
            <td style="padding: 10px 14px; font-weight: bold;">Message</td>
            <td style="padding: 10px 14px;">${inquiry.message}</td>
          </tr>
        </table>

        <div style="margin-top: 28px;">
          <a href="${dashboardUrl}"
            style="background: #0f766e; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 12px;">
            View in Admin Dashboard →
          </a>
          <a href="${whatsappUrl}"
            style="background: #25D366; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            💬 Reply on WhatsApp
          </a>
        </div>

      </body>
    </html>
  `;
}
