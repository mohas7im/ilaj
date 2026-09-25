// Request interceptor - runs before every request
import type { InternalAxiosRequestConfig } from "axios"
import { API_CONFIG } from "../config"

export function onRequest(config: InternalAxiosRequestConfig) {
  if (API_CONFIG.logRequests) {
    console.log(`${config.method?.toUpperCase()} ${config.url}`)
  }
  return config
}
