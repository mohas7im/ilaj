// GA4 event names for visitor actions that count as a lead. Sent from the
// website (LeadTracker, contact form submit) and read back by the admin
// Analytics page.
export const LEAD_EVENTS = {
  form: "generate_lead",
  whatsapp: "whatsapp_click",
  phone: "phone_click",
} as const

export const LEAD_EVENT_LABELS: Record<string, string> = {
  [LEAD_EVENTS.form]: "Form submissions",
  [LEAD_EVENTS.whatsapp]: "WhatsApp clicks",
  [LEAD_EVENTS.phone]: "Phone calls",
}
