import axios from "axios";

import { API_BASE_URL } from "@/config/apiConfig";

import {
  requestInterceptor,
  requestInterceptorError,
} from "@/interceptors/requestInterceptor";

import {
  responseInterceptor,
  responseInterceptorError,
} from "@/interceptors/responseInterceptor";


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


apiClient.interceptors.request.use(
  requestInterceptor,
  requestInterceptorError
);


apiClient.interceptors.response.use(
  responseInterceptor,
  responseInterceptorError
);
