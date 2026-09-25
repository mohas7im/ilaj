// Main API client - every browser → API call goes through this instance.
import axios from "axios"
import { API_CONFIG } from "./config"
import { onRequest } from "./interceptors/request"
import { createResponseErrorHandler } from "./interceptors/response"

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    Accept: "application/json",
  },
})

apiClient.interceptors.request.use(onRequest)
apiClient.interceptors.response.use(
  (response) => response,
  createResponseErrorHandler(apiClient)
)
