import axios from "axios";

import {
  requestInterceptor,
  requestInterceptorError,
} from "@/interceptors/requestInterceptor";

import {
  responseInterceptor,
  responseInterceptorError,
} from "@/interceptors/responseInterceptor";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  requestInterceptor,
  requestInterceptorError
);

apiClient.interceptors.response.use(
  responseInterceptor,
  responseInterceptorError
);
