import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export const runtime = "edge";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();

        const rows = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                role: users.role,
                status: users.status,
                lastLoginAt: users.lastLoginAt,
            })
            .from(users)
            .orderBy(desc(users.lastLoginAt));

        return NextResponse.json({ data: rows });
    } catch (error: any) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
