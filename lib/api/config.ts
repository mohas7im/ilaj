// API base URL and default configuration. The only place the API reads env vars.

export const API_CONFIG = {
  // Empty = same origin (this app's own route handlers). Set NEXT_PUBLIC_API_BASE_URL
  // only if the API moves to a separate host.
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  timeout: 15_000,
  withCredentials: true,
  logRequests: process.env.NODE_ENV === "development",
} as const
