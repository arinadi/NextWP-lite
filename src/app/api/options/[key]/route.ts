import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { options } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ key: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const { key } = await params;

        const result = await db.select().from(options).where(eq(options.key, key)).limit(1);

        if (result.length === 0) {
            return NextResponse.json({ key, value: null });
        }

        return NextResponse.json({ key, value: result[0].value });
    } catch (error: any) {
        console.error("Fetch option error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ key: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const { key } = await params;
        const body = await req.json();
        const { value } = body;

        // Upsert: insert or update
        await db
            .insert(options)
            .values({ key, value })
            .onConflictDoUpdate({
                target: options.key,
                set: { value },
            });

        return NextResponse.json({ key, value, success: true });
    } catch (error: any) {
        console.error("Update option error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
