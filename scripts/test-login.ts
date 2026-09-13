import "dotenv/config";

import { auth } from "../src/auth/auth";

async function testSession() {
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
  });

  if (login.error) {
    throw new Error(login.error.message);
  }

  console.log("Login successful.");
  console.log("User ID:", login.user.id);

  const session = await auth.api.getSession({
    headers: new Headers({
      cookie: login.headers?.get("set-cookie") ?? "",
    }),
  });

  if (!session) {
    throw new Error("Session was not created.");
  }

  console.log("Session created successfully.");
  console.log("Session ID:", session.session.id);
  console.log("Session User ID:", session.user.id);
}

testSession().catch((error) => {
  console.error("Session test failed:", error);
  process.exit(1);
});