import { isAxiosError } from "axios"

type ApiErrorBody = {
  error?: string | Record<string, string[] | string>
  message?: string
}

/**
 * Turns anything thrown by apiClient into a message fit for a toast.
 * Handles both error shapes the route handlers return:
 *   { error: "Doctor not found" }
 *   { error: { name: ["Required"], slug: ["Too short"] } }   (zod fieldErrors)
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data
    const detail = body?.error
    if (detail && typeof detail === "object") {
      return Object.values(detail).flat().join(", ") || fallback
    }
    return detail || body?.message || fallback
  }

  if (error instanceof Error) return error.message
  return fallback
}
