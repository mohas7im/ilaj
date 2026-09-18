import { apiClient } from "@/lib/apiClient";
import type { AxiosError } from "axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// ── In-Memory Cache ──────────────────────────────────────────────────────────
// Holds the authenticated user in browser memory across page transitions
let cachedUser: AuthUser | null = null;

// Deduplicates simultaneous calls (e.g. when sidebar & header mount simultaneously)
let inFlightMeRequest: Promise<AuthUser | null> | null = null;

export const authService = {
  /**
   * Logs in admin, sets HttpOnly cookie via server response, and caches user profile.
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const payload = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    };

    const { data } = await apiClient.post<AuthResponse>("/api/auth/login", payload);

    if (!data.success || !data.user) {
      throw new Error(data.error || "Authentication failed");
    }

    // Cache the user immediately on successful sign in
    cachedUser = data.user;
    return data.user;
  },

  /**
   * Logs out current session:
   * 1. Backend deletes the HttpOnly cookie.
   * 2. Frontend wipes the cached in-memory user.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/auth/logout");
    } finally {
      cachedUser = null;
      inFlightMeRequest = null;
    }
  },

  /**
   * Retrieves the currently authenticated admin user.
   * - Uses in-memory cache if available (0ms response, 0 extra network calls).
   * - Deduplicates concurrent calls to prevent multiple simultaneous requests.
   * - Pass `forceRefresh = true` if you explicitly need to fetch fresh data from the server.
   */
  async me(forceRefresh = false): Promise<AuthUser | null> {
    // 1. Instant return from memory cache
    if (cachedUser && !forceRefresh) {
      return cachedUser;
    }

    // 2. Reuse in-flight request if one is already pending
    if (inFlightMeRequest && !forceRefresh) {
      return inFlightMeRequest;
    }

    // 3. Perform network request and populate cache
    inFlightMeRequest = (async () => {
      try {
        const { data } = await apiClient.get<AuthResponse>("/api/auth/me");
        if (data.success && data.user) {
          cachedUser = data.user;
          return cachedUser;
        }
        cachedUser = null;
        return null;
      } catch {
        cachedUser = null;
        return null;
      } finally {
        inFlightMeRequest = null;
      }
    })();

    return inFlightMeRequest;
  },

  /**
   * Quick boolean check to see if an admin session is active.
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.me();
    return user !== null;
  },

  /**
   * Helper to safely extract user-friendly error messages from API responses.
   */
  getErrorMessage(error: unknown, fallback = "An unexpected error occurred."): string {
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosErr = error as AxiosError<{ error?: string; message?: string }>;
      return (
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        fallback
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  },
};
