import { requireAdmin } from "@/lib/auth/require-admin"

// Appointment route handlers (Placeholder)
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  return Response.json({ appointments: [] });
}
