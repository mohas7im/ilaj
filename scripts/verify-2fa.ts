import "dotenv/config";

import { auth } from "../src/auth/auth";

async function verifyTwoFactor() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD.");
  }

  const code = process.argv[2];

  if (!code) {
    throw new Error(
      "Missing TOTP code. Usage: npx tsx scripts/verify-2fa.ts 123456"
    );
  }

  // 1. Login
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

  // 2. Verify TOTP enrollment
  const result = await auth.api.verifyTOTP({
    body: {
      code,
    },
    headers: new Headers({
      cookie,
    }),
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  console.log("2FA/TOTP verification successful.");
  console.log("2FA is now enabled for the admin.");
}

verifyTwoFactor().catch((error) => {
  console.error("2FA verification failed:", error);
  process.exit(1);
});
