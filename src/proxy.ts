import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isSetupRoute = nextUrl.pathname === "/admin/setup";
    const isLoginRoute = nextUrl.pathname === "/admin/login";
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

    // Add pathname to request headers so server components can read it
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-invoke-path", nextUrl.pathname);

    const nextOptions = {
        request: {
            headers: requestHeaders,
        },
    };

    // 1. Allow API Auth routes always
    if (isApiAuthRoute) return NextResponse.next(nextOptions);

    // 2. Allow Setup route always (it has its own internal check)
    if (isSetupRoute) return NextResponse.next(nextOptions);

    // 3. Handle Admin Routes
    if (isAdminRoute) {
        if (isLoginRoute) {
            if (isLoggedIn) {
                return NextResponse.redirect(new URL("/admin", nextUrl));
            }
            return NextResponse.next(nextOptions);
        }

        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/admin/login", nextUrl));
        }
    }

    return NextResponse.next(nextOptions);
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
