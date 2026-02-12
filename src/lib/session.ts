import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server side.
 * Returns the session object or null if not authenticated.
 */
export async function getSession() {
    return await auth();
}

/**
 * Require authentication — redirects to login if no session.
 * Use this in server components or layouts that need auth.
 */
export async function requireAuth() {
    const session = await getSession();
    if (!session || !session.user) {
        redirect("/admin/login");
    }
    return session;
}

/**
 * Require a specific role — redirects to admin dashboard if insufficient permissions.
 */
export async function requireRole(roles: string[]) {
    const session = await requireAuth();
    // @ts-ignore
    if (session.user && !roles.includes(session.user.role as string)) {
        redirect("/admin");
    }
    return session;
}
