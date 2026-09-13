
import "dotenv/config";

import { auth } from "../src/auth/auth";

async function setupTwoFactor() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD.");
  }

  // 1. Login and get the authentication cookie
  const login = await auth.api.signInEmail({
    returnHeaders: true,
    body: {
      email,
      password,
    },
  });

  if (login.error) {
    throw new Error(login.error.message);
  }

  const cookie = login.headers.get("set-cookie");

  if (!cookie) {
    throw new Error("Authentication cookie was not returned.");
  }

  // 2. Enable TOTP
  const result = await auth.api.enableTwoFactor({
    body: {
      password,
      method: "totp",
      issuer: "Ilaj Dental Clinic",
    },
    headers: new Headers({
      cookie,
    }),
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  console.log("TOTP setup initialized.");
  console.log("TOTP URI received:", Boolean(result.totpURI));
  console.log("Backup codes received:", Boolean(result.backupCodes));

  if (result.totpURI) {
    console.log("\nTOTP URI:");
    console.log(result.totpURI);
  }

  if (result.backupCodes) {
    console.log("\nBackup codes:");
    console.log(result.backupCodes);
  }
}

setupTwoFactor().catch((error) => {
  console.error("2FA setup failed:", error);
  process.exit(1);
});