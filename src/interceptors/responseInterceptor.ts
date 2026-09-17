import type { AxiosError, AxiosResponse } from "axios";

export const responseInterceptor = (
  response: AxiosResponse
) => {
  return response;
};

export const responseInterceptorError = (
  error: AxiosError
) => {
  if (error.response?.status === 401) {
    console.log("Unauthorized request");

    // Refresh-token logic can be added later.
  }

  return Promise.reject(error);
};
