import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // If trying to access admin, check role
        if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, // Must be logged in
        },
    }
);

export const config = { matcher: ["/admin/:path*", "/profile/:path*"] };