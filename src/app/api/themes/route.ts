import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { options } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

// Available themes (matches src/lib/themes.ts registry)
const AVAILABLE_THEMES = [
    { id: "default", name: "Default", version: "1.0.0", author: "NextWP", description: "Clean and modern default theme" },
    { id: "magrib", name: "Magrib", version: "1.0.0", author: "Arinadi", description: "Dark elegant theme with Magrib styling" },
];

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const db = getDb();
        const result = await db.select().from(options).where(eq(options.key, "active_theme")).limit(1);
        const activeTheme = (result[0]?.value as string) || "default";

        const themes = AVAILABLE_THEMES.map(t => ({
            ...t,
            isActive: t.id === activeTheme,
        }));

        return NextResponse.json({ data: themes, activeTheme });
    } catch (error: any) {
        console.error("Fetch themes error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
