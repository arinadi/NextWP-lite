import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { posts, users, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const { id } = await params;

        const rows = await db
            .select({
                post: posts,
                author: { name: users.name, email: users.email, image: users.image },
                category: { id: categories.id, name: categories.name },
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .leftJoin(categories, eq(posts.categoryId, categories.id))
            .where(eq(posts.id, id))
            .limit(1);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error: any) {
        console.error("Fetch post error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

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
        const { title, content, excerpt, status, featuredImage, categoryId, allowComments, slug } = body;

        const updates: Record<string, any> = { updatedAt: new Date() };
        if (title !== undefined) updates.title = title;
        if (content !== undefined) updates.content = content;
        if (excerpt !== undefined) updates.excerpt = excerpt;
        if (status !== undefined) {
            updates.status = status;
            if (status === "published") updates.publishedAt = new Date();
        }
        if (featuredImage !== undefined) updates.featuredImage = featuredImage;
        if (categoryId !== undefined) updates.categoryId = categoryId;
        if (allowComments !== undefined) updates.allowComments = allowComments;
        if (slug !== undefined) updates.slug = slug;

        const [record] = await db
            .update(posts)
            .set(updates)
            .where(eq(posts.id, id))
            .returning();

        if (!record) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(record);
    } catch (error: any) {
        console.error("Update post error:", error);
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

        // Move to trash (soft delete)
        const [record] = await db
            .update(posts)
            .set({ status: "trash", updatedAt: new Date() })
            .where(eq(posts.id, id))
            .returning();

        if (!record) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete post error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
