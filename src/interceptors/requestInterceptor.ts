import type { InternalAxiosRequestConfig } from "axios";

export const requestInterceptor = (
  config: InternalAxiosRequestConfig
) => {
  console.log(
    `${config.method?.toUpperCase()} ${config.url}`
  );

  return config;
};

export const requestInterceptorError = (error: unknown) => {
  return Promise.reject(error);
};
