// Reset a forgotten admin password straight in the database.
//
//   node --env-file=.env scripts/reset-admin-password.mjs
//
// Asks for the admin email and a new password, stores it hashed (bcrypt, same
// as lib/auth/password.ts) and signs that admin out everywhere.
// Run it on a machine whose .env DATABASE_URL points at the database to fix.

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcryptjs";
import pg from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env scripts/reset-admin-password.mjs");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
const rl = readline.createInterface({ input, output });

try {
  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  await client.connect();
  const { rows } = await client.query('SELECT id FROM "user" WHERE lower(email) = $1', [email]);

  if (rows.length === 0) {
    const all = await client.query('SELECT email FROM "user" ORDER BY email');
    console.error(`No admin with email "${email}". Existing admins:`);
    for (const r of all.rows) console.error(`  - ${r.email}`);
    process.exitCode = 1;
  } else {
    const password = await rl.question("New password (min 6 characters): ");
    const confirm = await rl.question("Repeat new password: ");

    if (password.length < 6) {
      console.error("Password must be at least 6 characters.");
      process.exitCode = 1;
    } else if (password !== confirm) {
      console.error("Passwords do not match.");
      process.exitCode = 1;
    } else {
      const userId = rows[0].id;
      await client.query(
        'UPDATE "user" SET "passwordHash" = $1, "updatedAt" = now() WHERE id = $2',
        [await bcrypt.hash(password, 10), userId]
      );
      // Sign out any existing sessions for this admin
      await client.query(
        'UPDATE refresh_tokens SET "revokedAt" = now() WHERE "userId" = $1 AND "revokedAt" IS NULL',
        [userId]
      );
      console.log(`Password updated for ${email}. You can sign in at /admin/login.`);
    }
  }
} catch (err) {
  console.error("Could not reset the password:", err.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await client.end();
}
