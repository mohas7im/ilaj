import { Resend } from "resend";

let client: Resend | null = null;

// Built on first send, so a missing key only fails the email — never the request
// that imports this module (e.g. saving an inquiry).
export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return (client ??= new Resend(process.env.RESEND_API_KEY));
}
