import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((req) => {
    // Add pathname to request headers so server components can read it
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-invoke-path", req.nextUrl.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
});

export const config = {
    // Match all paths to ensure the header is available everywhere in admin
    matcher: ["/admin/:path*"],
};
