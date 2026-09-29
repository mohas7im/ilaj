import { cache } from "react";
import { getClinicSettings } from "@/server/services/settings.service";
import type { Stat } from "@/components/website/common/StatsList";

// Clinic settings (address, phone, hours, social links, ...), read once per
// request and reused by every Server Component that calls it in that render
// (Header, Footer, Hero, Contact, ...). A fresh request always refetches, so
// admin edits show up on the very next page load — no manual invalidation.
export const getSettings = cache(getClinicSettings);

/** The three clinic counters from admin settings; empty ones are left out. */
export async function getClinicStats(): Promise<Stat[]> {
  const settings = await getSettings();

  return [
    { label: "Years of Experience", value: settings.yearsOfExperience, description: "Clinical excellence." },
    { label: "Patients", value: settings.totalPatients, description: "Happy smiles treated." },
    { label: "Specialists", value: settings.specialists, description: "Across all dental fields." },
  ].filter((stat) => stat.value.trim());
}

/** "Mon – Fri: ..." / "Saturday: ..." / "Sunday: ..." lines; blank days are skipped. */
export async function getOpeningHours(): Promise<string[]> {
  const settings = await getSettings();

  return [
    settings.workingHoursWeekday && `Mon – Fri: ${settings.workingHoursWeekday}`,
    settings.workingHoursSaturday && `Saturday: ${settings.workingHoursSaturday}`,
    `Sunday: ${settings.sundayOpen ? settings.workingHoursSunday || "Open" : "Closed"}`,
  ].filter((line): line is string => Boolean(line));
}

// Digits-only, so a number stored as "+91 90485 81112" still forms a valid wa.me link.
export function toWhatsAppLink(number: string) {
  return `https://wa.me/${number.replace(/[^\d]/g, "")}`;
}

// tel: links reject spaces in some dialers; keep the leading "+" but strip the rest.
export function toTelLink(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
