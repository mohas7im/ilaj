import { cache } from "react";
import { getClinicSettings } from "@/server/services/settings.service";

// Clinic settings (address, phone, hours, social links, ...), read once per
// request and reused by every Server Component that calls it in that render
// (Header, Footer, Hero, Contact, ...). A fresh request always refetches, so
// admin edits show up on the very next page load — no manual invalidation.
export const getSettings = cache(getClinicSettings);
