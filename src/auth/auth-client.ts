import { createAuthClient } from "better-auth/react";
import {
  jwtClient,
  twoFactorClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

plugins: [
  twoFactorClient({
    onTwoFactorRedirect() {
      window.location.href = "/admin/login/2fa";
    },
  }),
  jwtClient(),
],
});