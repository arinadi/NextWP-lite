import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const { id } = await params;
        const body = await req.json();
        const { role, status } = body;

        const updates: Record<string, any> = {};
        if (role !== undefined) updates.role = role;
        if (status !== undefined) updates.status = status;

        const [record] = await db
            .update(users)
            .set(updates)
            .where(eq(users.id, id))
            .returning();

        if (!record) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ id: record.id, role: record.role, status: record.status });
    } catch (error: any) {
        console.error("Update user error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
