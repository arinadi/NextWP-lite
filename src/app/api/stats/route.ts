import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { posts, media, users } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export const runtime = "edge";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();

        const [postCount] = await db
            .select({ count: count() })
            .from(posts)
            .where(eq(posts.type, "post"));

        const [pageCount] = await db
            .select({ count: count() })
            .from(posts)
            .where(eq(posts.type, "page"));

        const [mediaCount] = await db
            .select({ count: count() })
            .from(media);

        const [draftCount] = await db
            .select({ count: count() })
            .from(posts)
            .where(eq(posts.status, "draft"));

        const [userCount] = await db
            .select({ count: count() })
            .from(users);

        return NextResponse.json({
            postCount: postCount.count,
            pageCount: pageCount.count,
            mediaCount: mediaCount.count,
            draftCount: draftCount.count,
            userCount: userCount.count,
        });
    } catch (error: any) {
        console.error("Fetch stats error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
