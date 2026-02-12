import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

/**
 * POST /api/setup — Deploy database schema (like WordPress install)
 * Only works if tables don't exist yet (idempotent via IF NOT EXISTS)
 */
export async function POST() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json(
                { error: "DATABASE_URL is not configured" },
                { status: 500 }
            );
        }

        const sql = neon(process.env.DATABASE_URL);

        // Execute schema creation (all tables with IF NOT EXISTS)
        await sql`
            -- 1. Users (NextAuth v5)
            CREATE TABLE IF NOT EXISTS "user" (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT NOT NULL UNIQUE,
                "emailVerified" TIMESTAMP,
                image TEXT,
                role TEXT DEFAULT 'user',
                status TEXT DEFAULT 'active',
                last_login_at TIMESTAMP
            );
        `;

        await sql`
            -- 2. Accounts (NextAuth v5)
            CREATE TABLE IF NOT EXISTS "account" (
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                type TEXT NOT NULL,
                provider TEXT NOT NULL,
                "providerAccountId" TEXT NOT NULL,
                refresh_token TEXT,
                access_token TEXT,
                expires_at INTEGER,
                token_type TEXT,
                scope TEXT,
                id_token TEXT,
                session_state TEXT,
                PRIMARY KEY (provider, "providerAccountId")
            );
        `;

        await sql`
            -- 3. Sessions (NextAuth v5)
            CREATE TABLE IF NOT EXISTS "session" (
                "sessionToken" TEXT PRIMARY KEY,
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                expires TIMESTAMP NOT NULL
            );
        `;

        await sql`
            -- 4. VerificationTokens (NextAuth v5)
            CREATE TABLE IF NOT EXISTS "verificationToken" (
                identifier TEXT NOT NULL,
                token TEXT NOT NULL,
                expires TIMESTAMP NOT NULL,
                PRIMARY KEY (identifier, token)
            );
        `;

        await sql`
            -- 5. Posts (Updated reference)
            CREATE TABLE IF NOT EXISTS "posts" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                slug VARCHAR(255) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                content JSONB NOT NULL,
                excerpt TEXT,
                status TEXT DEFAULT 'draft',
                featured_image VARCHAR,
                allow_comments BOOLEAN DEFAULT true,
                author_id TEXT NOT NULL REFERENCES "user"(id),
                created_at TIMESTAMP DEFAULT now(),
                updated_at TIMESTAMP DEFAULT now(),
                published_at TIMESTAMP
            );
        `;

        await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS slug_idx ON posts(slug);
        `;

        await sql`
            -- 6. Media
            CREATE TABLE IF NOT EXISTS "media" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                url VARCHAR NOT NULL,
                source TEXT DEFAULT 'local',
                type VARCHAR NOT NULL,
                alt_text VARCHAR,
                width INTEGER,
                height INTEGER,
                size INTEGER,
                uploaded_by TEXT REFERENCES "user"(id),
                uploaded_at TIMESTAMP DEFAULT now()
            );
        `;

        await sql`
            -- 7. Options (Key-Value config)
            CREATE TABLE IF NOT EXISTS "options" (
                key VARCHAR PRIMARY KEY,
                value JSONB,
                is_public BOOLEAN DEFAULT false
            );
        `;

        // Mark as installed
        await sql`
            INSERT INTO "options" (key, value)
            VALUES ('installed', 'true'::jsonb)
            ON CONFLICT (key) DO NOTHING;
        `;

        return NextResponse.json({ success: true, message: "Database schema deployed successfully!" });
    } catch (error) {
        console.error("Setup error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to deploy schema" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/setup — Check if already installed
 */
export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ installed: false, reason: "no_database_url" });
        }

        const sql = neon(process.env.DATABASE_URL);

        // Check if options table exists and has 'installed' key
        const result = await sql`
            SELECT (
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_name IN ('options', 'verificationToken')
            ) as table_count;
        `;

        if (Number(result[0]?.table_count) < 2) {
            return NextResponse.json({ installed: false, reason: "missing_tables" });
        }

        const installed = await sql`
            SELECT value FROM "options" WHERE key = 'installed';
        `;

        return NextResponse.json({
            installed: installed.length > 0,
        });
    } catch {
        return NextResponse.json({ installed: false, reason: "connection_error" });
    }
}
