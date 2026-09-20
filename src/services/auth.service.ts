import { signIn, signOut, getSession } from "next-auth/react";
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
  message?: string;
  user?: AuthUser;
  error?: string;
}

// ── In-Memory Cache ──────────────────────────────────────────────────────────
let cachedUser: AuthUser | null = null;
let inFlightMeRequest: Promise<AuthUser | null> | null = null;

export const authService = {
  /**
   * Logs in admin via NextAuth v5 credentials provider.
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      throw new Error("Invalid email or password");
    }

    // Refresh cached user from session
    const session = await getSession();
    if (session?.user) {
      cachedUser = {
        name: session.user.name || "Admin",
        email: session.user.email || email,
      };
      return cachedUser;
    }

    // Fallback if session is still populating
    cachedUser = {
      name: "Admin",
      email,
    };
    return cachedUser;
  },

  /**
   * Logs out current NextAuth session.
   */
  async logout(): Promise<void> {
    try {
      await signOut({ redirect: false });
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
