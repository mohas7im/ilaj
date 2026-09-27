/**
 * Reads a JSON-encoded multipart field (e.g. an array sent alongside files).
 * Missing → undefined. Invalid JSON is returned as the raw string so zod
 * rejects it with a 400 instead of the route crashing.
 */
export function parseJsonField(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string") return undefined
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
