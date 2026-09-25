import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken, ACCESS_TOKEN_COOKIE } from "@/lib/auth/token";

/**
 * Guards an admin route handler. Returns a 401 response when the request has no
 * valid access token, or null when the caller is a signed-in admin.
 *
 *   const denied = await requireAdmin()
 *   if (denied) return denied
 *
 * proxy.ts also blocks /api/admin/*, but each handler checks again so a matcher
 * change can never silently expose a route.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  const user = token ? await verifyAccessToken(token) : null;

  return user
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
