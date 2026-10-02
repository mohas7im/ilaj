import { NextResponse, type NextRequest } from "next/server";
import {
  verifyAccessToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/token";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  const user = accessToken ? await verifyAccessToken(accessToken) : null;
  const hasValidSession = !!user || !!refreshToken;

  // 0. Admin API: answer 401 (no redirect) so the client can refresh and retry.
  //    Each handler also calls requireAdmin(); this is the outer layer.
  if (pathname.startsWith("/api/admin")) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 1. If visiting /admin/login while already logged in -> redirect to dashboard
  if (pathname === "/admin/login") {
    if (user) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 2. Protect /admin/* routes: redirect to login if no tokens exist at all.
  //    (Admin images live in public/images/admin, outside this path.)
  if (pathname.startsWith("/admin")) {
    if (!hasValidSession) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
