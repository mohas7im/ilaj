import "dotenv/config";
import { auth } from "../src/auth/auth";


const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Clinic Admin";

if (!email || !password) {
  throw new Error(
    "Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables."
  );
}

async function createAdmin() {
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  console.log("Admin user created successfully.");
  console.log(`Email: ${email}`);
}

createAdmin().catch((error) => {
  console.error("Failed to create admin:", error);
  process.exit(1);
}); 