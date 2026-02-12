/**
 * Server-side admin layout with auth guards.
 * - /admin/login & /admin/setup → rendered without sidebar/topbar
 * - All other /admin/* pages → rendered within AdminShell
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { sql } from "drizzle-orm";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headerList = await headers();
    const pathname = headerList.get("x-invoke-path") || headerList.get("x-middleware-invoke-path") || "";

    const isLoginPage = pathname === "/admin/login";
    const isSetupPage = pathname === "/admin/setup";
    const isAuthFreePage = isLoginPage || isSetupPage;

    if (isAuthFreePage) {
        return <>{children}</>;
    }

    // Safe DB check: verify the "user" table exists and has rows.
    // Uses information_schema so it never fails even if tables are missing.
    try {
        const db = getDb();
        const result = await db.execute(
            sql`SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_name = 'user'
            ) AS table_exists`
        );
        const tableExists = result.rows?.[0]?.table_exists === true;

        if (!tableExists) {
            redirect("/admin/setup");
        }

        // Table exists — check if it has any users
        const countResult = await db.execute(sql`SELECT count(*)::int AS cnt FROM "user"`);
        const userCount = countResult.rows?.[0]?.cnt ?? 0;
        if (userCount === 0) {
            redirect("/admin/setup");
        }
    } catch {
        // DB unreachable or any unexpected error → go to setup
        redirect("/admin/setup");
    }

    const session = await auth();

    if (!session) {
        redirect("/admin/login");
    }

    return (
        <AdminShell
            userName={session.user?.name || "User"}
            userImage={session.user?.image || undefined}
        >
            {children}
        </AdminShell>
    );
}
