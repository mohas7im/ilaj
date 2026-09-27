// Shared by the FAQ filters and form: turns the services list into
// Select items. "general" stands for FAQs with no treatment (home page).

export type ServiceOption = { id: string; name: string }

export const GENERAL = "general"
export const GENERAL_LABEL = "General (Home Page)"

export function treatmentItems(services: ServiceOption[]): Record<string, string> {
  return {
    [GENERAL]: GENERAL_LABEL,
    ...Object.fromEntries(services.map((s) => [s.id, s.name])),
  }
}
