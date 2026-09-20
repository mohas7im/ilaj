import { apiClient } from "@/lib/apiClient";
import type { AxiosError } from "axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id?: string;
  name?: string | null;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  error?: string;
}

// ── In-Memory Cache ──────────────────────────────────────────────────────────
let cachedUser: AuthUser | null = null;
let inFlightMeRequest: Promise<AuthUser | null> | null = null;

export const authService = {
  /**
   * Logs in admin, sets HttpOnly cookies (15m access + 7d refresh in DB), and caches user profile.
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

    cachedUser = data.user;
    return data.user;
  },

  /**
   * Logs out current session:
   * 1. Backend revokes the refresh token in the database and deletes cookies.
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
   */
  async me(forceRefresh = false): Promise<AuthUser | null> {
    if (cachedUser && !forceRefresh) {
      return cachedUser;
    }

    if (inFlightMeRequest && !forceRefresh) {
      return inFlightMeRequest;
    }

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
