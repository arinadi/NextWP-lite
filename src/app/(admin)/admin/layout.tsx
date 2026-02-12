/**
 * Server-side admin layout with auth guards.
 * - /admin/login & /admin/setup → rendered without sidebar/topbar
 * - All other /admin/* pages → rendered within AdminShell
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headerList = await headers();
    const pathname = headerList.get("x-invoke-path") || headerList.get("x-middleware-invoke-path") || "";

    console.log("AdminLayout Pathname Debug:", { pathname, headers: Array.from(headerList.entries()) });

    const isLoginPage = pathname === "/admin/login";
    const isSetupPage = pathname === "/admin/setup";
    const isAuthFreePage = isLoginPage || isSetupPage;

    if (isAuthFreePage) {
        return <>{children}</>;
    }

    try {
        const userCount = await db.$count(users);
        if (userCount === 0) {
            redirect("/admin/setup");
        }
    } catch (e) {
        console.error("DB Error in layout:", e);
        // If DB is not reachable or tables missing, go to setup
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
