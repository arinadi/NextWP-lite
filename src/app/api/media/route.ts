import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { media } from "@/db/schema";
import { desc } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: Request) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = (page - 1) * limit;

        const db = getDb();

        // Fetch media items ordered by newest first
        const mediaItems = await db.select()
            .from(media)
            .orderBy(desc(media.uploadedAt))
            .limit(limit)
            .offset(offset);

        // Ideally we'd also fetch total count for pagination UI, but for now infinite scroll/load more is simpler

        return NextResponse.json({
            data: mediaItems,
            page,
            limit,
        });

    } catch (error: any) {
        console.error("Fetch media error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
