import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { media } from "@/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { url, name: customName } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Derive name from URL if not provided
        const derivedName = customName || decodeURIComponent(url.split("/").pop()?.split("?")[0] || "media");

        // Detect type from extension
        const ext = derivedName.split(".").pop()?.toLowerCase() || "";
        const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "ico"];
        const videoExts = ["mp4", "webm", "ogg", "mov", "avi"];
        let type = "application/octet-stream";
        if (imageExts.includes(ext)) type = `image/${ext === "jpg" ? "jpeg" : ext}`;
        else if (videoExts.includes(ext)) type = `video/${ext}`;

        const db = getDb();
        const [record] = await db.insert(media).values({
            url,
            source: "external",
            type,
            altText: derivedName,
            size: null,
            uploadedBy: session.user.id,
        }).returning();

        return NextResponse.json(record);
    } catch (error: any) {
        console.error("Add media from URL error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
