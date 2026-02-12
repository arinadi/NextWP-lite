import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { media } from "@/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const filename = searchParams.get("filename");

        if (!filename || !req.body) {
            return NextResponse.json({ error: "No filename or body" }, { status: 400 });
        }

        // 1. Upload to Vercel Blob
        const blob = await put(filename, req.body, {
            access: "public",
        });

        // 2. Save metadata to DB
        const db = getDb();
        const [record] = await db.insert(media).values({
            url: blob.url,
            source: "local",
            type: blob.contentType || "application/octet-stream",
            size: 0, // Vercel Blob PutBlobResult doesn't return size easily without extra steps or req.contentLength
            uploadedBy: session.user?.id,
        }).returning();

        return NextResponse.json(record);
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
