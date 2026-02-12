import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { categories, posts } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";

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
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
                description: categories.description,
                createdAt: categories.createdAt,
                postCount: count(posts.id),
            })
            .from(categories)
            .leftJoin(posts, eq(posts.categoryId, categories.id))
            .groupBy(categories.id)
            .orderBy(desc(categories.createdAt));

        return NextResponse.json({ data: rows });
    } catch (error: any) {
        console.error("Fetch categories error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const body = await req.json();
        const { name, description } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const [record] = await db.insert(categories).values({
            name,
            slug,
            description: description || null,
        }).returning();

        return NextResponse.json(record);
    } catch (error: any) {
        console.error("Create category error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
