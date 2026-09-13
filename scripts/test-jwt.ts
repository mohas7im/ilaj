import "dotenv/config";

import { auth } from "../src/auth/auth";

async function testJwt() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing ADMIN_EMAIL or ADMIN_PASSWORD.");
  }

  const login = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    returnHeaders: true,
  });

  console.log("Login response received.");

  if ((login as any).error) {
    throw new Error((login as any).error.message);
  }

  const cookie = login.headers.get("set-cookie");

  if (!cookie) {
    throw new Error("No authentication cookie returned.");
  }

  const token = await auth.api.getToken({
    headers: new Headers({
      cookie,
    }),
  });

  if (!token) {
    throw new Error("JWT was not generated.");
  }

  console.log("JWT generated successfully.");
  console.log("Token received:", Boolean(token.token));
}

testJwt().catch((error) => {
  console.error("JWT test failed:", error);
  process.exit(1);
});
