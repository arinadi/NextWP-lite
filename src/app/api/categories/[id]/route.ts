import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
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
        const { name, slug, description } = body;

        const updates: Record<string, any> = {};
        if (name !== undefined) updates.name = name;
        if (slug !== undefined) updates.slug = slug;
        if (description !== undefined) updates.description = description;

        const [record] = await db
            .update(categories)
            .set(updates)
            .where(eq(categories.id, id))
            .returning();

        if (!record) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(record);
    } catch (error: any) {
        console.error("Update category error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
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

        const [record] = await db
            .delete(categories)
            .where(eq(categories.id, id))
            .returning();

        if (!record) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete category error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
