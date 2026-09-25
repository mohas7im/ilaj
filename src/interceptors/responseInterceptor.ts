import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { refreshSession, redirectToLogin } from "@/lib/auth/session";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

export const responseInterceptorError = async (error: AxiosError) => {
  const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

  // Intercept 401 Unauthorized errors and attempt background token refresh
  if (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest._retry &&
    !originalRequest.url?.includes("/api/auth/login") &&
    !originalRequest.url?.includes("/api/auth/refresh")
  ) {
    originalRequest._retry = true;

    // Silent refresh using the 7-day DB-backed refresh token. Parallel 401s
    // share a single refresh request (see refreshSession).
    if (await refreshSession()) {
      // Retry original request now that new access token cookie is set
      return axios(originalRequest);
    }

    // Refresh token is expired or revoked -> redirect to login
    redirectToLogin();
    return Promise.reject(error);
  }

  // If 401 on an unhandled request while inside admin panel -> redirect
  if (error.response?.status === 401) {
    redirectToLogin();
  }

  return Promise.reject(error);
};
