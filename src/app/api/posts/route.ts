import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { posts, users, categories } from "@/db/schema";
import { eq, desc, like, sql, and, count } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "post";
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = (page - 1) * limit;

        // Build conditions
        const conditions = [eq(posts.type, type as "post" | "page")];
        if (status && status !== "all") {
            conditions.push(eq(posts.status, status as any));
        }
        if (search) {
            conditions.push(like(posts.title, `%${search}%`));
        }

        const rows = await db
            .select({
                post: posts,
                author: { name: users.name, email: users.email, image: users.image },
                category: { id: categories.id, name: categories.name },
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .leftJoin(categories, eq(posts.categoryId, categories.id))
            .where(and(...conditions))
            .orderBy(desc(posts.updatedAt))
            .limit(limit)
            .offset(offset);

        // Get counts by status
        const countRows = await db
            .select({ status: posts.status, count: count() })
            .from(posts)
            .where(eq(posts.type, type as "post" | "page"))
            .groupBy(posts.status);

        const counts: Record<string, number> = {};
        let total = 0;
        for (const r of countRows) {
            counts[r.status || "draft"] = r.count;
            total += r.count;
        }
        counts["all"] = total;

        return NextResponse.json({ data: rows, counts, page, limit });
    } catch (error: any) {
        console.error("Fetch posts error:", error);
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
        const { title, content, excerpt, status, type, featuredImage, categoryId, allowComments } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            + "-" + Date.now().toString(36);

        const [record] = await db.insert(posts).values({
            title,
            slug,
            content: content || [],
            excerpt: excerpt || "",
            status: status || "draft",
            type: type || "post",
            featuredImage: featuredImage || null,
            categoryId: categoryId || null,
            allowComments: allowComments ?? true,
            authorId: session.user.id,
            publishedAt: status === "published" ? new Date() : null,
        }).returning();

        return NextResponse.json(record);
    } catch (error: any) {
        console.error("Create post error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
