// Client-side session helpers used by apiClient's response interceptor.

let inFlightRefresh: Promise<boolean> | null = null;

/**
 * Exchanges the refresh-token cookie for a new token pair. Concurrent callers
 * share one request: /api/auth/refresh rotates the token and treats reuse of an
 * old one as theft, so two parallel refreshes would revoke every session.
 */
export function refreshSession(): Promise<boolean> {
  inFlightRefresh ??= fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      inFlightRefresh = null;
    });

  return inFlightRefresh;
}

export function redirectToLogin(): void {
  if (typeof window === "undefined") return;

  const { pathname } = window.location;
  if (pathname.startsWith("/admin") && !pathname.includes("/admin/login")) {
    window.location.href = "/admin/login?expired=1";
  }
}
