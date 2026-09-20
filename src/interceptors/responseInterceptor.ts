import type { AxiosError, AxiosResponse } from "axios";

export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

export const responseInterceptorError = async (error: AxiosError) => {
  // Handle 401 Unauthorized: session expired while inside admin panel
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
