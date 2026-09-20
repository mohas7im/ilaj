import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

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

    try {
      // Attempt silent background refresh using the 7-day DB-backed refresh token
      await axios.post("/api/auth/refresh", {}, { withCredentials: true });

      // Retry original request now that new access token cookie is set
      return axios(originalRequest);
    } catch (refreshError) {
      // Refresh token is expired or revoked -> redirect to login
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (pathname.startsWith("/admin") && !pathname.includes("/admin/login")) {
          window.location.href = "/admin/login?expired=1";
        }
      }
      return Promise.reject(refreshError);
    }
  }

  // If 401 on an unhandled request while inside admin panel -> redirect
  if (error.response?.status === 401) {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/admin") && !pathname.includes("/admin/login")) {
        window.location.href = "/admin/login?expired=1";
      }
    }
  }

  return Promise.reject(error);
};
