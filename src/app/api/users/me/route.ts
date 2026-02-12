import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                role: users.role,
                status: users.status,
            })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("Fetch current user error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const body = await req.json();
        const { name, image } = body;

        const updates: Record<string, any> = {};
        if (name !== undefined) updates.name = name;
        if (image !== undefined) updates.image = image;

        const [record] = await db
            .update(users)
            .set(updates)
            .where(eq(users.id, session.user.id))
            .returning();

        if (!record) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ id: record.id, name: record.name, email: record.email, image: record.image });
    } catch (error: any) {
        console.error("Update current user error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
