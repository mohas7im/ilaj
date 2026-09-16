import { NextResponse, type NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth/token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Check for the auth_token cookie
  const token = req.cookies.get("auth_token")?.value;
  const user = token ? await verifyJwt(token) : null;

  // 2. If visiting /admin/login while already logged in -> redirect to /admin/dashboard
  if (pathname === "/admin/login") {
    if (user) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 3. If visiting any other /admin route without valid auth -> redirect to /admin/login
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Only run on admin routes to ensure zero performance impact on public website pages
export const config = {
  matcher: ["/admin/:path*"],
};
